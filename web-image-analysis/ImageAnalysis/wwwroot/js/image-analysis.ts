//import * as signalR from '@microsoft/signalr';

document.addEventListener('DOMContentLoaded', () => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl('/analysisHub')
        .build();

    connection.on('ReceiveAnalysis', async (data: any) => {
        const img = document.getElementById('analyzedImage') as HTMLImageElement;
        const canvas = document.getElementById('boundingBoxCanvas') as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d');

        const waitForImage = () => new Promise<void>((resolve: () => void, reject: (reason?: any) => void) => {
            if (img.complete && img.naturalWidth > 0) return resolve();
            img.addEventListener('load', () => resolve(), { once: true });
            img.addEventListener('error', reject, { once: true });
            if ('decode' in img) img.decode().then(resolve).catch(() => {});
        });

        if (data.imageDataUrl) {
            const ready = waitForImage();
            img.src = data.imageDataUrl;
            const result = document.getElementById('analysisResults');
            if (result) {
                result.style.display = 'block';
            }
            await ready;
        } else {
            await waitForImage();
        }

        if (data.analysisResult && canvas && ctx) {
            const result = data.analysisResult;

            const rect = img.getBoundingClientRect();
            canvas.width = Math.max(1, Math.round(rect.width || img.naturalWidth));
            canvas.height = Math.max(1, Math.round(rect.height || img.naturalHeight));

            const scaleX = canvas.width / Math.max(1, img.naturalWidth);
            const scaleY = canvas.height / Math.max(1, img.naturalHeight);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const people = result.people?.values ?? [];
            if (people.length > 0) {
                ctx.strokeStyle = '#00FF00';
                ctx.fillStyle = '#00FF00';

                people.forEach((person: any) => {
                    if (person.confidence > 0.8) {
                        const x = person.boundingBox.x * scaleX;
                        const y = person.boundingBox.y * scaleY;
                        const w = person.boundingBox.width * scaleX;
                        const h = person.boundingBox.height * scaleY;
                        ctx.strokeRect(x, y, w, h);
                        ctx.fillText('Person', x, Math.max(10, y - 5));
                    }
                });
            }
            console.log(result);
            const read = result.read?.blocks ?? [];
            if (read.length > 0) {

                ctx.strokeStyle = '#00FF00';
                ctx.fillStyle = '#00FF00';


                read.forEach((text: any) => {
                    text.lines.forEach((line: any) => {
                        console.log(line);
                        const rawPoints = line.boundingPolygon; // e.g. [x1, y1, x2, y2, ...]
                        const points = [];

                        for (let i = 0; i < rawPoints.length; i += 2) {
                            points.push({
                                x: rawPoints[i].x * scaleX,
                                y: rawPoints[i + 1].y * scaleY
                            });
                        }

                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        for (let i = 1; i < points.length; i++) {
                            ctx.lineTo(points[i].x, points[i].y);
                        }
                        ctx.closePath();
                        ctx.stroke();
                    });
                });
            }

            let detailsHtml = '';
            if (result.caption) {
                detailsHtml += `<div><strong>Caption:</strong> ${result.caption.text} (Confidence: ${Number(result.caption.confidence).toFixed(2)})</div>`;
            }
            if (result.tags?.values?.length > 0) {
                detailsHtml += '<div><strong>Tags:</strong> ' + result.tags.values.map((t: any) => t.name).join(', ') + '</div>';
            }
            document.getElementById('analysisDetails')!.innerHTML = detailsHtml;
        }

        document.getElementById('loadingIcon')?.classList.add('d-none');
        document.getElementById('searchIcon')?.classList.remove('d-none');
        document.getElementById('submitText')!.textContent = 'Analyze Image';
        (document.getElementById('submitBtn') as HTMLButtonElement).disabled = false;
    });

    connection.on('AnalysisFailed', (errorMessage: string) => {
        alert(errorMessage);

        document.getElementById('loadingIcon')?.classList.add('d-none');
        document.getElementById('searchIcon')?.classList.remove('d-none');
        document.getElementById('submitText')!.textContent = 'Analyze Image';
        (document.getElementById('submitBtn') as HTMLButtonElement).disabled = false;
    });

    connection.start().catch((err: any) => {
        console.error(err.toString());
    });

    document.getElementById('uploadForm')?.addEventListener('submit', (e) => {
        e.preventDefault();

        console.log('evet');

        const fileInput = document.getElementById('imageInput') as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (!file) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Image = (e.target?.result as string).split(',')[1];

            document.getElementById('loadingIcon')?.classList.remove('d-none');
            document.getElementById('searchIcon')?.classList.add('d-none');
            document.getElementById('submitText')!.textContent = 'Analyzing...';
            (document.getElementById('submitBtn') as HTMLButtonElement).disabled = true;

            connection.invoke('AnalyzeImage', base64Image).catch((err: any) => {
                console.error(err.toString());

                document.getElementById('loadingIcon')?.classList.add('d-none');
                document.getElementById('searchIcon')?.classList.remove('d-none');
                document.getElementById('submitText')!.textContent = 'Analyze Image';
                (document.getElementById('submitBtn') as HTMLButtonElement).disabled = false;
            });
        };

        reader.readAsDataURL(file);
    });
});