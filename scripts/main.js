document.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('gearSvg');
    const gearGenerator = new GearGenerator(svg);
    
    const moduleInput = document.getElementById('moduleInput');
    const teethInput = document.getElementById('teethInput');
    const pressureAngle = document.getElementById('pressureAngle');
    const drawButton = document.getElementById('drawGear');
    const zoomRange = document.getElementById('zoomRange');
    
    let currentModule = parseFloat(moduleInput.value);
    let currentTeeth = parseInt(teethInput.value);
    let currentAngle = parseFloat(pressureAngle.value);
    
    // 繪製按鈕點擊事件
    drawButton.addEventListener('click', () => {
        currentModule = parseFloat(moduleInput.value);
        currentTeeth = parseInt(teethInput.value);
        currentAngle = parseFloat(pressureAngle.value);
        
        if (isNaN(currentModule) || isNaN(currentTeeth) || currentModule <= 0 || currentTeeth < 8) {
            alert('請輸入有效的模數和齒數（齒數至少為8）');
            return;
        }
        
        gearGenerator.drawGear(currentModule, currentTeeth, parseFloat(zoomRange.value), currentAngle);
    });
    
    // 縮放事件
    zoomRange.addEventListener('change', () => {
        if (currentModule && currentTeeth) {
            gearGenerator.drawGear(currentModule, currentTeeth, parseFloat(zoomRange.value));
        }
    });
    
    // 初始繪製
    gearGenerator.drawGear(currentModule, currentTeeth, 1.0, currentAngle);
});