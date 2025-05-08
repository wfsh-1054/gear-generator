class GearGenerator {
    constructor(svg) {
        this.svg = svg;
        this.svgNS = "http://www.w3.org/2000/svg";
        
        // 清除現有內容
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
    }

    // 計算齒輪所有參數
    calculateGearParameters(module, teeth, pressureAngle) {
        const pitchDiameter = module * teeth;           // 節圓直徑
        const addendum = module;                        // 齒頂高
        const dedendum = 1.25 * module;                 // 齒根高
        const pressureAngleRad = pressureAngle * Math.PI / 180;  // 壓力角（轉換為弧度）
        
        // 計算各圓直徑
        const baseCircleDiameter = pitchDiameter * Math.cos(pressureAngleRad);  // 基圓直徑
        const outerDiameter = pitchDiameter + 2 * addendum;                  // 齒頂圓直徑
        const rootDiameter = pitchDiameter - 2 * dedendum;                   // 齒根圓直徑
    
        return {
            pitchDiameter,    // 節圓直徑
            baseCircleDiameter, // 基圓直徑
            outerDiameter,    // 齒頂圓直徑
            rootDiameter      // 齒根圓直徑
        };
    }

    // 創建圓形
    createCircle(cx, cy, r, strokeColor, strokeDasharray = "") {
        const circle = document.createElementNS(this.svgNS, "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", strokeColor);
        if (strokeDasharray) {
            circle.setAttribute("stroke-dasharray", strokeDasharray);
        }
        return circle;
    }

    // 創建十字標記
    createCross(cx, cy, size, strokeColor) {
        const group = document.createElementNS(this.svgNS, "g");
        
        // 創建水平線
        const horizontalLine = document.createElementNS(this.svgNS, "line");
        horizontalLine.setAttribute("x1", cx - size);
        horizontalLine.setAttribute("y1", cy);
        horizontalLine.setAttribute("x2", cx + size);
        horizontalLine.setAttribute("y2", cy);
        horizontalLine.setAttribute("stroke", strokeColor);
        
        // 創建垂直線
        const verticalLine = document.createElementNS(this.svgNS, "line");
        verticalLine.setAttribute("x1", cx);
        verticalLine.setAttribute("y1", cy - size);
        verticalLine.setAttribute("x2", cx);
        verticalLine.setAttribute("y2", cy + size);
        verticalLine.setAttribute("stroke", strokeColor);
        
        group.appendChild(horizontalLine);
        group.appendChild(verticalLine);
        return group;
    }

    // 創建網格
    createGrid(size, scale) {
        const group = document.createElementNS(this.svgNS, "g");
        const gridSize = size * scale; // 1公分 = size像素
        const width = this.svg.width.baseVal.value;
        const height = this.svg.height.baseVal.value;
        
        // 計算網格線的範圍
        const startX = -Math.floor(width / (2 * gridSize)) * gridSize;
        const endX = Math.ceil(width / (2 * gridSize)) * gridSize;
        const startY = -Math.floor(height / (2 * gridSize)) * gridSize;
        const endY = Math.ceil(height / (2 * gridSize)) * gridSize;
        
        // 繪製垂直線
        for (let x = startX; x <= endX; x += gridSize) {
            const line = document.createElementNS(this.svgNS, "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", startY);
            line.setAttribute("x2", x);
            line.setAttribute("y2", endY);
            line.setAttribute("stroke", "#ddd");
            line.setAttribute("stroke-width", "0.5");
            group.appendChild(line);
        }
        
        // 繪製水平線
        for (let y = startY; y <= endY; y += gridSize) {
            const line = document.createElementNS(this.svgNS, "line");
            line.setAttribute("x1", startX);
            line.setAttribute("y1", y);
            line.setAttribute("x2", endX);
            line.setAttribute("y2", y);
            line.setAttribute("stroke", "#ddd");
            line.setAttribute("stroke-width", "0.5");
            group.appendChild(line);
        }
        
        return group;
    }

    // 繪製齒輪
    drawGear(module, teeth, zoomFactor = 1.0, pressureAngle = 20) {
        const params = this.calculateGearParameters(module, teeth, pressureAngle);
        const scale = Math.min(250 / params.outerDiameter, 5) * zoomFactor;
        
        // 清除現有內容
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
        
        // 創建一個群組元素，用於居中齒輪
        const group = document.createElementNS(this.svgNS, "g");
        group.setAttribute("transform", `translate(${this.svg.width.baseVal.value/2}, ${this.svg.height.baseVal.value/2})`);
        
        // 繪製網格（1公分一格）
        group.appendChild(this.createGrid(10, scale)); // 10像素 = 1公分
        
        // 繪製齒根圓（小點虛線）
        const rootCircle = this.createCircle(0, 0, params.rootDiameter/2 * scale, "#666", "1,3");
        rootCircle.setAttribute("stroke-width", "0.5");
        group.appendChild(rootCircle);
        
        // 繪製基圓（短虛線，紅色）
        const baseCircle = this.createCircle(0, 0, params.baseCircleDiameter/2 * scale, "#ff0000", "2,2");
        baseCircle.setAttribute("stroke-width", "1");
        group.appendChild(baseCircle);
        
        // 繪製節圓（虛線長度等於一個齒距的一半）
        const pitchCircle = this.createCircle(0, 0, params.pitchDiameter/2 * scale, "#333");
        const pitchCircumference = Math.PI * params.pitchDiameter * scale;
        const toothPitch = (pitchCircumference / teeth) / 2;
        pitchCircle.setAttribute("stroke-dasharray", `${toothPitch},${toothPitch}`);
        group.appendChild(pitchCircle);
        
        // 繪製齒頂圓（小點虛線）
        const outerCircle = this.createCircle(0, 0, params.outerDiameter/2 * scale, "#666", "1,3");
        outerCircle.setAttribute("stroke-width", "0.5");
        group.appendChild(outerCircle);
        
        // 繪製中心十字標記
        group.appendChild(this.createCross(0, 0, 5, "#333"));
        
        // 繪製漸開線齒形
        const baseRadius = params.baseCircleDiameter / 2;
        const pitchRadius = params.pitchDiameter / 2;
        
        // 計算起始角度（基圓到齒頂圓的展開角度）
        const startAngle = 0;
        const endAngle = Math.sqrt((params.outerDiameter/2/baseRadius)**2 - 1);
        
        // 生成漸開線路徑
        const involutePath = this.createInvolutePath(baseRadius, startAngle, endAngle);
        
        // 計算旋轉角度（1/4齒距）
        const toothAngle = (2 * Math.PI) / teeth; // 一個齒的角度
        const rotationAngle = -(toothAngle / 4); // 逆時針旋轉1/4齒距
        
        // 創建旋轉群組
        const rotatedGroup = document.createElementNS(this.svgNS, "g");
        rotatedGroup.setAttribute("transform", `rotate(${rotationAngle * 180 / Math.PI})`);
        
        // 將漸開線添加到旋轉群組中
        const path = this.createSvgPath(involutePath, scale);
        rotatedGroup.appendChild(path);
        
        // 將旋轉後的群組添加到主群組
        group.appendChild(rotatedGroup);
        
        this.svg.appendChild(group);
    }

    // 計算漸開線上的點
    calculateInvolutePoint(baseRadius, angle) {
        // angle 是展開角度（弧度）
        // 漸開線方程式：
        // x = r * (cos(t) + t * sin(t))
        // y = r * (sin(t) - t * cos(t))
        // 其中 r 是基圓半徑，t 是展開角度
        
        const x = baseRadius * (Math.cos(angle) + angle * Math.sin(angle));
        const y = baseRadius * (Math.sin(angle) - angle * Math.cos(angle));
        
        return { x, y };
    }

    // 生成漸開線路徑
    createInvolutePath(baseRadius, startAngle, endAngle, steps = 50) {
        const path = [];
        const angleStep = (endAngle - startAngle) / steps;
        
        for (let i = 0; i <= steps; i++) {
            const angle = startAngle + i * angleStep;
            path.push(this.calculateInvolutePoint(baseRadius, angle));
        }
        
        return path;
    }

    // 創建SVG路徑
    createSvgPath(points, scale) {
        const group = document.createElementNS(this.svgNS, "g");
        
        // 繪製漸開線路徑
        let pathData = `M ${points[0].x * scale},${points[0].y * scale}`;
        for (let i = 1; i < points.length; i++) {
            pathData += ` L ${points[i].x * scale},${points[i].y * scale}`;
        }
        const path = document.createElementNS(this.svgNS, "path");
        path.setAttribute("d", pathData);
        path.setAttribute("stroke", "blue");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-width", "1");
        group.appendChild(path);
        
        // 在起點添加紅色圓點
        const startPoint = document.createElementNS(this.svgNS, "circle");
        startPoint.setAttribute("cx", points[0].x * scale);
        startPoint.setAttribute("cy", points[0].y * scale);
        startPoint.setAttribute("r", "2");
        startPoint.setAttribute("fill", "red");
        group.appendChild(startPoint);
        
        return group;
    }
}