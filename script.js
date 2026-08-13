document.addEventListener('DOMContentLoaded', () => {
    const portraitUpload = document.getElementById('portraitUpload');
    const uploadPreviewImage = document.getElementById('uploadPreviewImage');
    const uploadIcon = document.getElementById('uploadIcon');
    const uploadText = document.getElementById('uploadText');
    
    const previewImage = document.getElementById('previewImage');
    const previewIcon = document.getElementById('previewIcon');
    const previewName = document.getElementById('previewName');
    const previewRole = document.getElementById('previewRole');
    const previewStack = document.getElementById('previewStack');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    
    const nameInput = document.getElementById('nameInput');
    const roleInput = document.getElementById('roleInput');
    const stackInput = document.getElementById('stackInput');
    const githubInput = document.getElementById('githubInput');
    
    let uploadedImageDataUrl = null;
    let uploadedImageObj = null;

    const bgImageUrl = 'https://lh3.googleusercontent.com/aida/AP1WRLvyhHiZdHbdUf3SxmTAWzTcWVVQDYlXZK4XpezZGr9zl5-LDa5wT9EdPMSnGW75z-U4uBYuZ-9nAJ6lbFqacDIDUh-caYiV7bBDcX74S90_Sc4AL-sBDu35ujRLTwphbBBBVc5TV1AyLY3zf2IfNIdl0_7_tPL6RNVLeVhmBJOmdFO87VvENk4d0ecYcNDY204bzDYnjzZQW4cP33BRCx2hD658BHABhOehMU9G7W8wRcHUCS3gq9Y_jSU';
    const baseTemplate = new Image();
    baseTemplate.crossOrigin = "Anonymous";
    baseTemplate.src = bgImageUrl;

    portraitUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedImageDataUrl = event.target.result;
                if(uploadPreviewImage) {
                    uploadPreviewImage.src = uploadedImageDataUrl;
                    uploadPreviewImage.classList.remove('hidden');
                }
                if(uploadIcon) uploadIcon.classList.add('hidden');
                if(uploadText) uploadText.classList.add('hidden');
                
                uploadedImageObj = new Image();
                uploadedImageObj.src = uploadedImageDataUrl;
            };
            reader.readAsDataURL(file);
        }
    });
    
    function updateQRCode() {
        if (!qrCodeContainer) return;
        qrCodeContainer.innerHTML = '';
        const githubHandle = githubInput.value.trim().replace(/^@/, ''); 
        const githubUrl = githubHandle ? `https://github.com/${githubHandle}` : 'https://github.com/';
        
        new QRCode(qrCodeContainer, {
            text: githubUrl,
            width: 128, 
            height: 128,
            colorDark: "#04120c",
            colorLight: "transparent",
            correctLevel : QRCode.CorrectLevel.L
        });
        
        setTimeout(() => {
            const qrElement = qrCodeContainer.querySelector('canvas') || qrCodeContainer.querySelector('img');
            if(qrElement) {
                qrElement.style.width = '100%';
                qrElement.style.height = '100%';
                qrElement.style.objectFit = 'contain';
            }
        }, 10);
    }

    generateBtn.addEventListener('click', () => {
        if(previewName) previewName.textContent = nameInput.value.trim() || 'Your_name';
        if(previewRole) previewRole.textContent = roleInput.value.trim() || 'Your_role';
        if(previewStack) previewStack.textContent = stackInput.value.trim() || 'Your Stack';
        
        updateQRCode();
        
        if(uploadedImageDataUrl && previewImage) {
            previewImage.style.backgroundImage = `url(${uploadedImageDataUrl})`;
            previewImage.classList.remove('hidden');
            if(previewIcon) previewIcon.classList.add('hidden');
        }
    });

    function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    async function loadFontsForCanvas() {
        if (document.fonts) {
            try {
                await document.fonts.load('bold 84px "JetBrains Mono"');
                await document.fonts.load('bold 56px "JetBrains Mono"');
                await document.fonts.load('bold 36px "JetBrains Mono"');
                await document.fonts.load('bold 32px "JetBrains Mono"');
                await document.fonts.load('normal 26px "JetBrains Mono"');
                await document.fonts.load('normal 22px "JetBrains Mono"');
            } catch (e) {
                console.log("Font loading error:", e);
            }
        }
    }

    async function generateRawCanvas() {
        updateQRCode();
        await new Promise(r => setTimeout(r, 100));
        
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = 1080;
        finalCanvas.height = 1620;
        const ctx = finalCanvas.getContext('2d');
        
        const bgColor = '#04120c';
        const greenPrimary = '#d1ef72';
        const greenLight = '#e2f4a6';
        const p = 60; 
        const innerWidth = finalCanvas.width - (p * 2);
        
        // 1. Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        
        if (baseTemplate.complete && baseTemplate.naturalHeight !== 0) {
            const imgAspect = baseTemplate.width / baseTemplate.height;
            const canvasAspect = finalCanvas.width / finalCanvas.height;
            let drawW = finalCanvas.width;
            let drawH = finalCanvas.height;
            let drawX = 0;
            let drawY = 0;
            if (imgAspect > canvasAspect) {
                drawW = finalCanvas.height * imgAspect;
                drawX = -(drawW - finalCanvas.width) / 2;
            } else {
                drawH = finalCanvas.width / imgAspect;
                drawY = -(drawH - finalCanvas.height) / 2;
            }
            ctx.drawImage(baseTemplate, drawX, drawY, drawW, drawH);
            // Dark precise overlay
            ctx.fillStyle = 'rgba(4, 18, 12, 0.92)';
            ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        }
        
        // 2. Outer Border (Thin)
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(209, 239, 114, 0.3)';
        ctx.strokeRect(6, 6, finalCanvas.width - 12, finalCanvas.height - 12);
        
        // Fonts
        const fontTitle = 'bold 84px "JetBrains Mono"';
        const fontName = 'bold 56px "JetBrains Mono"';
        const fontAccent = 'bold 36px "JetBrains Mono"';
        const fontHandle = 'bold 32px "JetBrains Mono"';
        const fontSubtitle = 'normal 26px "JetBrains Mono"';
        const fontMicro = 'normal 22px "JetBrains Mono"';
        
        // --- 1. HEADER ALIGNMENT & LOGO ---
        const padding = 80;
        
        // "HHGOA ." - Shifted up to y = 100
        ctx.fillStyle = '#D1EF72';
        ctx.font = 'bold 72px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('HHGOA .', padding, 100);
        
        // "HACKER IDENTITY SYSTEM" - Neatly tucked beneath at y = 150
        ctx.font = '24px "JetBrains Mono", monospace';
        ctx.fillStyle = '#A3B86C'; // Slightly muted for hierarchy
        ctx.fillText('HACKER IDENTITY SYSTEM', padding, 150);
        
        // "AUTH // VERIFIED" - Shifted UP to y = 150 (now perfectly aligned with the left subheader)
        ctx.textAlign = 'right';
        ctx.fillStyle = '#A3B86C';
        ctx.font = '20px "JetBrains Mono", monospace';
        ctx.fillText('AUTH // VERIFIED', finalCanvas.width - padding, 150);
        
        // Horizontal Divider Line - Pushed down to y = 175 so text doesn't cross it
        ctx.beginPath();
        ctx.moveTo(padding, 175);
        ctx.lineTo(finalCanvas.width - padding, 175);
        ctx.strokeStyle = '#D1EF72'; // Using the neon lime for the line
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw the new 2:47PM Studio Logo (Top Right Corner)
        const logoImg = document.getElementById('goa-logo');
        if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
            const logoWidth = 180; // Adjust this to scale the logo
            const logoRatio = logoImg.naturalHeight / logoImg.naturalWidth;
            const logoHeight = logoWidth * logoRatio;
            
            // Positioned in the top right corner, above the "AUTH // VERIFIED" text
            const logoX = finalCanvas.width - padding - logoWidth;
            const logoY = 60; 
            
            ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
        } else {
            // Fallback if logo fails to load: Draw original '● LIVE' text
            ctx.fillStyle = '#D1EF72';
            ctx.fillText('● LIVE', finalCanvas.width - padding, 110);
        }
        
        // Reset text alignment to left for the rest of the card rendering
        ctx.textAlign = 'left';
        
        // --- 2. FIXED PHOTO & FRAME COORDINATES ---
        const photoSize = 480;                          // 480x480 square
        const photoX = (finalCanvas.width - photoSize) / 2;  // Perfectly centered (300px)
        const photoY = 250;                             // Pushed down to prevent header overlap!
        
        // --- 3. DRAW PHOTO WITH CLIPPING MASK ---
        ctx.save();
        ctx.fillStyle = '#020906';
        ctx.fillRect(photoX, photoY, photoSize, photoSize);
        
        if (uploadedImageObj && uploadedImageObj.complete && uploadedImageObj.naturalWidth !== 0) {
            const scale = Math.max(photoSize / uploadedImageObj.naturalWidth, photoSize / uploadedImageObj.naturalHeight);
            const drawWidth = uploadedImageObj.naturalWidth * scale;
            const drawHeight = uploadedImageObj.naturalHeight * scale;
            const offsetX = (photoSize - drawWidth) / 2;
            const offsetY = (photoSize - drawHeight) / 2;
            
            ctx.save();
            ctx.beginPath();
            ctx.rect(photoX, photoY, photoSize, photoSize);
            ctx.clip(); 
            
            ctx.drawImage(uploadedImageObj, photoX + offsetX, photoY + offsetY, drawWidth, drawHeight);
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.rect(photoX, photoY, photoSize, photoSize);
            ctx.clip();
        }
        ctx.restore(); 
        
        // --- 4. BRACKET CORNERS ---
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(209, 239, 114, 0.2)';
        ctx.strokeRect(photoX, photoY, photoSize, photoSize);
        
        ctx.strokeStyle = '#D1EF72';
        ctx.lineWidth = 4;
        const bLen = 35; // Length of bracket arms
        
        ctx.beginPath();
        // Top-Left
        ctx.moveTo(photoX, photoY + bLen); ctx.lineTo(photoX, photoY); ctx.lineTo(photoX + bLen, photoY);
        // Top-Right
        ctx.moveTo(photoX + photoSize - bLen, photoY); ctx.lineTo(photoX + photoSize, photoY); ctx.lineTo(photoX + photoSize, photoY + bLen);
        // Bottom-Right
        ctx.moveTo(photoX + photoSize, photoY + photoSize - bLen); ctx.lineTo(photoX + photoSize, photoY + photoSize); ctx.lineTo(photoX + photoSize - bLen, photoY + photoSize);
        // Bottom-Left
        ctx.moveTo(photoX + bLen, photoY + photoSize); ctx.lineTo(photoX, photoY + photoSize); ctx.lineTo(photoX, photoY + photoSize - bLen);
        ctx.stroke();
        
        // 5. Data Details
        const nameVal = nameInput.value.trim().toUpperCase() || 'YOUR_NAME';
        const roleVal = roleInput.value.trim().toUpperCase() || 'YOUR_ROLE';
        const stackVal = stackInput.value.trim().toUpperCase() || 'YOUR STACK';
        const githubHandle = githubInput.value.trim() || '@your_handle';
        
        const drawLabel = (txt, y) => {
            ctx.fillStyle = 'rgba(209, 239, 114, 0.6)';
            ctx.font = fontMicro;
            ctx.textBaseline = 'top';
            ctx.fillText(txt, p, y);
        };
        
        // --- 5. RE-CALIBRATED TEXT Y-COORDINATES ---
        const yName = photoY + photoSize + 80;   // y = 810
        const yRole = yName + 130;               // y = 940
        const yStack = yRole + 120;              // y = 1060
        const yHandle = yStack + 120;            // y = 1180
        const yDivider = 1330;                   // Bottom divider line
        const yFooterLine = 1380;                // Barcode and QR code area
        
        drawLabel('NAME', yName);
        ctx.fillStyle = 'rgba(209, 239, 114, 0.4)';
        ctx.fillText('ID:0x8F9A', finalCanvas.width - p - 130, yName);
        
        ctx.fillStyle = greenLight;
        ctx.font = fontName;
        ctx.fillText(nameVal, p, yName + 30);
        
        // Role & Access Grid
        const midX = p + (innerWidth / 2);
        
        drawLabel('ROLE', yRole);
        ctx.fillStyle = greenPrimary;
        ctx.font = fontAccent;
        ctx.fillText(roleVal, p, yRole + 30);
        
        ctx.fillStyle = 'rgba(209, 239, 114, 0.6)';
        ctx.font = fontMicro;
        ctx.fillText('ACCESS', midX, yRole);
        ctx.fillStyle = greenPrimary;
        ctx.font = fontAccent;
        ctx.fillText('ALL AREAS', midX, yRole + 30);
        
        drawLabel('STACK', yStack);
        ctx.fillStyle = greenPrimary;
        ctx.font = fontAccent;
        ctx.fillText(stackVal, p, yStack + 30);
        
        // GitHub Handle
        drawLabel('GITHUB', yHandle);
        ctx.fillStyle = greenPrimary;
        ctx.font = fontHandle;
        ctx.fillText(githubHandle, p, yHandle + 30);
        
        // Decorative Divider Line
        ctx.lineWidth = 2;
        ctx.strokeStyle = greenPrimary;
        ctx.beginPath();
        ctx.moveTo(p, yDivider);
        ctx.lineTo(finalCanvas.width - p, yDivider);
        ctx.stroke();
        
        // Footer Line (thinner)
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(209, 239, 114, 0.3)';
        ctx.beginPath();
        ctx.moveTo(p, yFooterLine);
        ctx.lineTo(finalCanvas.width - p, yFooterLine);
        ctx.stroke();
        
        // Footer (Barcode + QR)
        let bcX = p;
        const bcY = yFooterLine + 25;
        const bcH = 100; // Scaled up height to visually match QR size
        const bcPattern = [8, 4, 16, 4, 12, 8, 24, 4, 8, 16, 2, 12, 8];
        ctx.fillStyle = 'rgba(209, 239, 114, 0.7)';
        for (let w of bcPattern) {
            ctx.fillRect(bcX, bcY, w, bcH);
            bcX += w + 6; 
        }
        
        ctx.fillStyle = 'rgba(209, 239, 114, 0.8)';
        ctx.font = fontMicro;
        ctx.fillText('SYS.CODE // 22B.881', p, bcY + 130);
        
        const qrSize = 180; // Enlarge QR code to 180x180
        const qrX = finalCanvas.width - p - qrSize;
        const qrY = yFooterLine + 15;
        
        ctx.fillStyle = greenPrimary;
        drawRoundedRect(ctx, qrX, qrY, qrSize, qrSize, 8);
        ctx.fill();
        
        const qrCanvas = qrCodeContainer ? qrCodeContainer.querySelector('canvas') : null;
        const qrImg = qrCodeContainer ? qrCodeContainer.querySelector('img') : null;
        const qrSource = (qrImg && qrImg.src) ? qrImg : qrCanvas;
        
        if (qrSource) {
            const qrPad = 8;
            ctx.drawImage(qrSource, qrX + qrPad, qrY + qrPad, qrSize - (qrPad*2), qrSize - (qrPad*2));
        }
        
        return finalCanvas;
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">refresh</span> Generating...';
            downloadBtn.disabled = true;
            
            await loadFontsForCanvas();
            
            const finalCanvas = await generateRawCanvas();
            const nameVal = nameInput.value.trim() || 'hacker';
            
            const link = document.createElement('a');
            link.download = `hhgoa-id-${nameVal.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = finalCanvas.toDataURL("image/png");
            link.click();
            
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const text = "I just generated my HHGOA Hacker Identity!";
            const url = window.location.href;
            
            if (navigator.share) {
                try {
                    const originalText = shareBtn.innerHTML;
                    shareBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">refresh</span> Preparing...';
                    shareBtn.disabled = true;

                    await loadFontsForCanvas();
                    const finalCanvas = await generateRawCanvas();
                    
                    finalCanvas.toBlob(async (blob) => {
                        const file = new File([blob], 'hhgoa-id.png', { type: 'image/png' });
                        try {
                            await navigator.share({
                                title: 'HHGOA Hacker Identity',
                                text: text,
                                url: url,
                                files: [file]
                            });
                        } catch (err) {}
                    });
                    
                    shareBtn.innerHTML = originalText;
                    shareBtn.disabled = false;
                    return; 
                } catch (e) {}
            }
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            window.open(twitterUrl, '_blank');
        });
    }
});
