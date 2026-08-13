document.addEventListener('DOMContentLoaded', () => {
    const portraitUpload = document.getElementById('portraitUpload');
    const uploadPreviewImage = document.getElementById('uploadPreviewImage');
    const uploadIcon = document.getElementById('uploadIcon');
    const uploadText = document.getElementById('uploadText');
    const manualCropBtn = document.getElementById('manualCropBtn');

    const cropModal = document.getElementById('cropModal');
    const cropperImage = document.getElementById('cropperImage');
    const cancelCropBtn = document.getElementById('cancelCropBtn');
    const saveCropBtn = document.getElementById('saveCropBtn');

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

    const rolePills = document.getElementById('rolePills');
    const stackPills = document.getElementById('stackPills');
    const roleDropdown = document.getElementById('roleDropdown');
    const stackDropdown = document.getElementById('stackDropdown');

    let uploadedImageDataUrl = null;
    let uploadedImageObj = null;
    let rawUploadedFile = null;
    let cropper = null;

    const bgImageUrl = 'https://lh3.googleusercontent.com/aida/AP1WRLvyhHiZdHbdUf3SxmTAWzTcWVVQDYlXZK4XpezZGr9zl5-LDa5wT9EdPMSnGW75z-U4uBYuZ-9nAJ6lbFqacDIDUh-caYiV7bBDcX74S90_Sc4AL-sBDu35ujRLTwphbBBBVc5TV1AyLY3zf2IfNIdl0_7_tPL6RNVLeVhmBJOmdFO87VvENk4d0ecYcNDY204bzDYnjzZQW4cP33BRCx2hD658BHABhOehMU9G7W8wRcHUCS3gq9Y_jSU';
    const baseTemplate = new Image();
    baseTemplate.crossOrigin = "Anonymous";
    baseTemplate.src = bgImageUrl;

    const logoImg = new Image();
    logoImg.src = 'logo.png';

    // --- AUTOCOMPLETE & PILL LOGIC ---
    const rolesList = ['Developer', 'Designer', 'Product Manager', 'Founder', 'Hacker', 'Engineer', 'Data Scientist', 'Content Creator', 'Marketer', 'Builder'];
    const stacksList = ['React', 'Next.js', 'Go', 'Python', 'Rust', 'Figma', 'Node.js', 'Solidity', 'TailwindCSS', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'C++', 'C#', 'AI', 'UI/UX'];

    let selectedRole = '';
    let selectedStacks = [];

    function renderPills() {
        rolePills.innerHTML = selectedRole ? `<div class="bg-black text-[#e2f4a6] px-3 py-0.7 rounded-full flex items-center gap-1 font-bold text-xs border border-[#e2f4a6]/20"><span>${selectedRole}</span><span class="material-symbols-outlined text-[14px] cursor-pointer hover:text-white" onclick="removeRole()">close</span></div>` : '';
        stackPills.innerHTML = selectedStacks.map(s => `<div class="bg-black text-[#e2f4a6] px-3 py-0.7 rounded-full flex items-center gap-1 font-bold text-xs border border-[#e2f4a6]/20"><span>${s}</span><span class="material-symbols-outlined text-[14px] cursor-pointer hover:text-white" onclick="removeStack('${s}')">close</span></div>`).join('');
        roleInput.style.display = selectedRole ? 'none' : 'block';
        stackInput.style.display = selectedStacks.length >= 3 ? 'none' : 'block';
        validateForm();
    }

    window.removeRole = () => { selectedRole = ''; renderPills(); };
    window.removeStack = (s) => { selectedStacks = selectedStacks.filter(x => x !== s); renderPills(); };

    function setupAutocomplete(inputEl, dropdownEl, dataList, isRole) {
        inputEl.addEventListener('input', () => {
            const val = inputEl.value.toLowerCase();
            if (!val) { dropdownEl.classList.add('hidden'); return; }
            const matches = dataList.filter(item => item.toLowerCase().includes(val) && (isRole ? true : !selectedStacks.includes(item)));
            if (matches.length > 0) {
                dropdownEl.innerHTML = matches.map(m => `<div class="p-2 text-primary hover:bg-primary hover:text-secondary-container cursor-pointer transition-colors" data-val="${m}">${m}</div>`).join('');
                dropdownEl.classList.remove('hidden');
            } else {
                dropdownEl.classList.add('hidden');
            }
        });
        dropdownEl.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'div' && e.target.dataset.val) {
                if (isRole) {
                    selectedRole = e.target.dataset.val;
                } else if (selectedStacks.length < 3) {
                    selectedStacks.push(e.target.dataset.val);
                }
                inputEl.value = '';
                dropdownEl.classList.add('hidden');
                renderPills();
            }
        });
        document.addEventListener('click', (e) => {
            if (e.target !== inputEl && e.target !== dropdownEl) dropdownEl.classList.add('hidden');
        });
    }

    setupAutocomplete(roleInput, roleDropdown, rolesList, true);
    setupAutocomplete(stackInput, stackDropdown, stacksList, false);

    // Allow user to hit Enter to add custom pill if not in list
    stackInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && stackInput.value.trim() && selectedStacks.length < 3) {
            e.preventDefault();
            selectedStacks.push(stackInput.value.trim().toUpperCase());
            stackInput.value = '';
            stackDropdown.classList.add('hidden');
            renderPills();
        }
    });
    roleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && roleInput.value.trim() && !selectedRole) {
            e.preventDefault();
            selectedRole = roleInput.value.trim().toUpperCase();
            roleInput.value = '';
            roleDropdown.classList.add('hidden');
            renderPills();
        }
    });

    // --- FORM VALIDATION ---
    function validateForm() {
        const isValid = nameInput.value.trim() !== '' &&
            githubInput.value.trim() !== '' &&
            selectedRole !== '' &&
            selectedStacks.length > 0 &&
            uploadedImageDataUrl !== null;

        if (isValid) {
            generateBtn.classList.remove('opacity-50', 'pointer-events-none');
        } else {
            generateBtn.classList.add('opacity-50', 'pointer-events-none');
        }
        return isValid;
    }

    [nameInput, githubInput].forEach(el => el.addEventListener('input', validateForm));

    // --- IMAGE UPLOAD & CROPPER ---
    portraitUpload.addEventListener('change', async (e) => {
        rawUploadedFile = e.target.files[0];
        if (!rawUploadedFile) return;

        if (uploadIcon) uploadIcon.textContent = 'hourglass_empty';
        if (uploadText) uploadText.textContent = 'CROPPING...';

        const formData = new FormData();
        formData.append('image', rawUploadedFile);

        try {
            const response = await fetch('/api/crop', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Server crop failed');

            const blob = await response.blob();
            setCroppedImage(URL.createObjectURL(blob));

            if (uploadIcon) uploadIcon.classList.add('hidden');
            if (uploadText) uploadText.classList.add('hidden');
            manualCropBtn.classList.remove('hidden');

        } catch (error) {
            console.error(error);
            alert("Error processing image on server. Falling back to original image.");
            setCroppedImage(URL.createObjectURL(rawUploadedFile));
            manualCropBtn.classList.remove('hidden');
            if (uploadIcon) uploadIcon.classList.add('hidden');
            if (uploadText) uploadText.classList.add('hidden');
        }
    });

    function setCroppedImage(dataUrl) {
        uploadedImageDataUrl = dataUrl;
        if (uploadPreviewImage) {
            uploadPreviewImage.src = uploadedImageDataUrl;
            uploadPreviewImage.classList.remove('hidden');
        }
        uploadedImageObj = new Image();
        uploadedImageObj.src = uploadedImageDataUrl;
        validateForm();
    }

    manualCropBtn.addEventListener('click', () => {
        if (!rawUploadedFile) return;
        cropperImage.src = URL.createObjectURL(rawUploadedFile);
        cropModal.classList.remove('hidden');

        if (cropper) cropper.destroy();
        cropper = new Cropper(cropperImage, {
            aspectRatio: 1,
            viewMode: 1,
            background: false
        });
    });

    cancelCropBtn.addEventListener('click', () => {
        cropModal.classList.add('hidden');
        if (cropper) { cropper.destroy(); cropper = null; }
    });

    saveCropBtn.addEventListener('click', () => {
        if (!cropper) return;
        const canvas = cropper.getCroppedCanvas({
            width: 1080,
            height: 1080,
            fillColor: '#000'
        });
        setCroppedImage(canvas.toDataURL('image/jpeg', 0.9));
        cropModal.classList.add('hidden');
        cropper.destroy(); cropper = null;
    });

    // --- PREVIEW GENERATION ---
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
            correctLevel: QRCode.CorrectLevel.L
        });

        setTimeout(() => {
            const qrElement = qrCodeContainer.querySelector('canvas') || qrCodeContainer.querySelector('img');
            if (qrElement) {
                qrElement.style.width = '100%';
                qrElement.style.height = '100%';
                qrElement.style.objectFit = 'contain';
            }
        }, 10);
    }

    // Call initially to disable button
    validateForm();

    generateBtn.addEventListener('click', () => {
        if (!validateForm()) return;
        if (previewName) previewName.textContent = nameInput.value.trim();
        if (previewRole) previewRole.textContent = selectedRole;
        if (previewStack) previewStack.textContent = selectedStacks.join(', ');

        updateQRCode();

        if (uploadedImageDataUrl && previewImage) {
            previewImage.style.backgroundImage = `url(${uploadedImageDataUrl})`;
            previewImage.classList.remove('hidden');
            if (previewIcon) previewIcon.classList.add('hidden');
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
                await document.fonts.load('bold 64px "JetBrains Mono"');
                await document.fonts.load('bold 36px "JetBrains Mono"');
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

        // 1. Background (Rounded Corners)
        drawRoundedRect(ctx, 0, 0, finalCanvas.width, finalCanvas.height, 40);
        ctx.clip();
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

        // 2.5 Lanyard Hole
        const lanyardW = 240;
        const lanyardH = 40;
        const lanyardX = (finalCanvas.width - lanyardW) / 2;
        const lanyardY = 30;

        ctx.fillStyle = '#020906';
        drawRoundedRect(ctx, lanyardX, lanyardY, lanyardW, lanyardH, 15);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(209, 239, 114, 0.2)';
        ctx.stroke();

        // Fonts
        const fontTitle = 'bold 96px "JetBrains Mono"';
        const fontName = 'bold 76px "JetBrains Mono"';
        const fontAccent = 'bold 44px "JetBrains Mono"';
        const fontSubtitle = 'normal 30px "JetBrains Mono"';
        const fontMicro = 'normal 26px "JetBrains Mono"';

        // 3. Header
        ctx.fillStyle = greenLight;
        ctx.font = fontTitle;
        ctx.textBaseline = 'top';
        ctx.fillText('HHGOA.', p, p);

        ctx.fillStyle = 'rgba(209, 239, 114, 0.7)';
        ctx.font = fontSubtitle;
        const subtitle = 'HACKER IDENTITY SYSTEM';
        let cx = p;
        for (let i = 0; i < subtitle.length; i++) {
            ctx.fillText(subtitle[i], cx, p + 95);
            cx += ctx.measureText(subtitle[i]).width + 6;
        }

        if (logoImg.complete && logoImg.naturalHeight !== 0) {
            const logoH = 100;
            const logoW = (logoImg.width / logoImg.height) * logoH;
            const logoX = finalCanvas.width - p - logoW;
            const logoY = p + 20;
            ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(209, 239, 114, 0.2)';
        ctx.beginPath();
        ctx.moveTo(p, p + 140);
        ctx.lineTo(finalCanvas.width - p, p + 140);
        ctx.stroke();

        // 4. Portrait Area
        const portraitY = p + 200;
        const portraitSize = innerWidth * 0.8;
        const pBox = p + (innerWidth * 0.1);

        ctx.save();
        ctx.fillStyle = '#020906';
        ctx.fillRect(pBox, portraitY, portraitSize, portraitSize);

        const frameMargin = 16;
        const pX = pBox + frameMargin;
        const pY = portraitY + frameMargin;
        const pS = portraitSize - (frameMargin * 2);

        ctx.beginPath();
        ctx.rect(pX, pY, pS, pS);
        ctx.clip();

        if (uploadedImageObj) {
            const imgAspect = uploadedImageObj.width / uploadedImageObj.height;
            let drawW = pS;
            let drawH = pS;
            let drawX = pX;
            let drawY = pY;
            if (imgAspect > 1) {
                drawW = pS * imgAspect;
                drawX = pX - (drawW - pS) / 2;
            } else {
                drawH = pS / imgAspect;
                drawY = pY - (drawH - pS) / 2;
            }
            ctx.drawImage(uploadedImageObj, drawX, drawY, drawW, drawH);
        }
        ctx.restore();

        // Portrait Border & Corner brackets
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(209, 239, 114, 0.2)';
        ctx.strokeRect(pBox, portraitY, portraitSize, portraitSize);

        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(209, 239, 114, 0.5)';
        const b = 40;

        ctx.beginPath(); ctx.moveTo(pBox, portraitY + b); ctx.lineTo(pBox, portraitY); ctx.lineTo(pBox + b, portraitY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pBox + portraitSize - b, portraitY); ctx.lineTo(pBox + portraitSize, portraitY); ctx.lineTo(pBox + portraitSize, portraitY + b); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pBox, portraitY + portraitSize - b); ctx.lineTo(pBox, portraitY + portraitSize); ctx.lineTo(pBox + b, portraitY + portraitSize); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pBox + portraitSize - b, portraitY + portraitSize); ctx.lineTo(pBox + portraitSize, portraitY + portraitSize); ctx.lineTo(pBox + portraitSize, portraitY + portraitSize - b); ctx.stroke();

        // 5. Data Details
        const nameVal = nameInput.value.trim().toUpperCase() || 'YOUR_NAME';
        const roleVal = selectedRole || 'YOUR_ROLE';
        const stackVal = selectedStacks.join(', ') || 'YOUR_STACK';

        const drawLabel = (txt, y) => {
            ctx.fillStyle = 'rgba(209, 239, 114, 0.6)';
            ctx.font = fontMicro;
            ctx.textBaseline = 'top';
            ctx.fillText(txt, p, y);
        };

        const yName = 1180;
        const yRole = 1280;
        const yStack = 1370;
        const yFooterLine = 1450;

        drawLabel('NAME', yName);
        ctx.fillStyle = 'rgba(209, 239, 114, 0.4)';
        ctx.fillText('ID:0x8F9A', finalCanvas.width - p - 130, yName);

        ctx.fillStyle = greenLight;
        ctx.font = fontName;
        ctx.fillText(nameVal, p, yName + 35);

        // Role & Access Grid
        const midX = p + (innerWidth / 2);

        drawLabel('ROLE', yRole);
        ctx.fillStyle = greenPrimary;
        ctx.font = fontAccent;
        ctx.fillText(roleVal, p, yRole + 35);

        ctx.fillStyle = 'rgba(209, 239, 114, 0.6)';
        ctx.font = fontMicro;
        ctx.fillText('ACCESS', midX, yRole);
        ctx.fillStyle = greenPrimary;
        ctx.font = fontAccent;
        ctx.fillText('ALL AREAS', midX, yRole + 35);

        drawLabel('STACK', yStack);
        ctx.fillStyle = greenPrimary;
        ctx.font = fontAccent;
        ctx.fillText(stackVal, p, yStack + 35);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(209, 239, 114, 0.3)';
        ctx.beginPath();
        ctx.moveTo(p, yFooterLine);
        ctx.lineTo(finalCanvas.width - p, yFooterLine);
        ctx.stroke();

        // Footer (Barcode + QR)
        let bcX = p;
        const bcY = yFooterLine + 25;
        const bcH = 60;
        const bcPattern = [8, 4, 16, 4, 12, 8, 24, 4, 8, 16, 2, 12, 8];
        ctx.fillStyle = 'rgba(209, 239, 114, 0.7)';
        for (let w of bcPattern) {
            ctx.fillRect(bcX, bcY, w, bcH);
            bcX += w + 6;
        }

        ctx.fillStyle = 'rgba(209, 239, 114, 0.8)';
        ctx.font = fontMicro;
        ctx.fillText('SYS.CODE // 22B.881', p, bcY + 75);

        const qrSize = 130;
        const qrX = finalCanvas.width - p - qrSize;
        const qrY = yFooterLine + 5;

        ctx.fillStyle = greenPrimary;
        drawRoundedRect(ctx, qrX, qrY, qrSize, qrSize, 8);
        ctx.fill();

        const qrCanvas = qrCodeContainer ? qrCodeContainer.querySelector('canvas') : null;
        const qrImg = qrCodeContainer ? qrCodeContainer.querySelector('img') : null;
        const qrSource = (qrImg && qrImg.src) ? qrImg : qrCanvas;

        if (qrSource) {
            const qrPad = 8;
            ctx.drawImage(qrSource, qrX + qrPad, qrY + qrPad, qrSize - (qrPad * 2), qrSize - (qrPad * 2));
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
            const text = "I just generated my HHGOA Hacker Identity! #FrameInGoa";

            const originalText = shareBtn.innerHTML;
            shareBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">refresh</span> Preparing...';
            shareBtn.disabled = true;

            await loadFontsForCanvas();
            const finalCanvas = await generateRawCanvas();

            finalCanvas.toBlob(async (blob) => {
                const nameVal = nameInput.value.trim() || 'hacker';
                const file = new File([blob], `hhgoa-id-${nameVal.replace(/\s+/g, '-').toLowerCase()}.png`, { type: 'image/png' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            text: text,
                            files: [file]
                        });
                    } catch (err) { console.error("Error sharing:", err); }
                } else {
                    // Fallback: download image and open intent
                    const link = document.createElement('a');
                    link.download = file.name;
                    link.href = URL.createObjectURL(blob);
                    link.click();

                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                    setTimeout(() => window.open(twitterUrl, '_blank'), 300);
                }

                shareBtn.innerHTML = originalText;
                shareBtn.disabled = false;
            });
        });
    }
});
