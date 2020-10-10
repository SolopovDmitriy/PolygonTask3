const Polygon = {
    points: [],//массив вершин многоугольника,
    isLastPoint: function(index) {
        return index === this.points.length - 1
    },
    getPerimeter: function() {// функция для получения периметра
        let perimeter = 0// начальное значение для нашего периметра

        for (let i = 0; i < this.points.length; i++) {// цикл идет по всем нашим вершинам
            // get current and next top
            const currentPoint = this.points[i]//вычисляем текущую вершину
            const nextPoint = this.isLastPoint(i) ? this.points[0] : this.points[i + 1]//вычисляем следущую вершину, если дошли до конца массва, т.е. индекс последней вершины равен последнему i, тогда берем первую вершину

            // get vector coordinates (x, y): A(x1, y1), B(x2, y2) => AB = (x2 - x1, y2 - y1)
            const vector = {
                x: nextPoint.x - currentPoint.x,
                y: nextPoint.y - currentPoint.y
            }

            // get vector module (scalar): AB(x, y) => sqrt(x ^ 2 + y ^ 2)
            const vectorLength = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))//вычисляем длину вектора
            // add vector module to perimeter
            perimeter += vectorLength//считаем периметр фигуры
        }

        return perimeter
    },
    getSquare: function() {
        let sumX = 0
        let sumY = 0

        for (let i = 0; i < this.points.length; i++) {//идем по всем вершинам
            // get current and next top
            const currentPoint = this.points[i]//currentTop - текущая вершина, this.points[i] - массив вершин у текущего многоугольника
            const nextPoint = this.isLastPoint(i) ? this.points[0] : this.points[i + 1]//индексы вершин, если индекс последней  вершины равен последнему i в итерации, то присваиваем значение первой вершине, а иначе берем следущую вершину 

            // multiply matching coordinates
            sumX += currentPoint.x * nextPoint.y// sumX берем х - у тукущей вершины и умножаем на Y следующей вершины 
            sumY += currentPoint.y * nextPoint.x// sumY берем Y - у тукущей вершины и умножаем на X у  следующей вершины 
        }

        return Math.abs(sumX - sumY) / 2// сначала отнимаем, потом модуль, а потом делим
    },
    draw: function() {
        const canvas = document.getElementById('canvas')
        canvas.width = 600
        canvas.height = 600
        const ctx = canvas.getContext('2d')

        for (let i = 0; i < this.points.length; i++) {
            const currentPoint = this.points[i]
            const nextPoint = this.isLastPoint(i) ? this.points[0] : this.points[i + 1]

            const multiplier = 50

            const currentX = currentPoint.x * multiplier
            const currentY = currentPoint.y * multiplier

            const nextX = nextPoint.x * multiplier
            const nextY = nextPoint.y * multiplier

            ctx.beginPath()

            const px = 5
            
            ctx.moveTo(currentX, currentY)
            ctx.font = 'bold 14px Verdana'
            ctx.fillStyle = '#BD634F'
            ctx.fillText(formatPointInfo(i, currentPoint), currentX + px, currentY - px)
            ctx.lineTo(nextX, nextY)
            ctx.stroke()

            ctx.closePath()
        }
    }
}

const formatPointInfo = (i, point) => `P${i + 1} (${point.x}; ${point.y})`

const fillMarkupWithData = () => {
    // draw polygon
    Polygon.draw()

    const points = Polygon.points

    // set points amount
    const pointsAmountSpan = document.getElementById('points-amount')
    pointsAmountSpan.innerHTML = points.length

    // calculate and set points' info
    let pointsInfoStr = ''
    points.forEach((point, i) => pointsInfoStr += `${formatPointInfo(i, point)}, `)

    const pointsInfoSpan = document.getElementById('points-info')
    pointsInfoSpan.innerHTML = pointsInfoStr.slice(0, -2)

    // set perimeter
    const perimeterSpan = document.getElementById('perimeter')
    perimeterSpan.innerHTML = Polygon.getPerimeter().toFixed(2)

    // set square
    const squareSpan = document.getElementById('square')
    squareSpan.innerHTML = Polygon.getSquare()
}

const pointsAmountInput = document.getElementById('points-amount-input')
pointsAmountInput.addEventListener('change', function(e) {
    const pointsAmount = e.target.value
    const coordinatesInputsDiv = document.getElementById('coordinates-inputs')
    coordinatesInputsDiv.innerHTML = ''

    const createCoordinateInput = placeholder => {
        const input = document.createElement('input')
        input.type = 'text'
        input.placeholder = placeholder

        input.addEventListener('change', function() {
            let allInputsAreFilled = true
            const children = coordinatesInputsDiv.children

            for (const child of children) {
                if (child.type === 'text') {
                    if (!child.value) {
                        allInputsAreFilled = false
                        break
                    }
                }
            }

            if (allInputsAreFilled) {
                // clear canvas
                const canvas = document.getElementById('canvas')
                const ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                // clear points array
                Polygon.points = []

                for (let i = 1; i < children.length; i += 4) {
                    const x = children.item(i).value
                    const y = children.item(i + 1).value
                    Polygon.points.push({ x, y })//кладем объет в наш массив вершин  points
                }

                fillMarkupWithData()
            }
        })

        coordinatesInputsDiv.appendChild(input)
    }

    for (let i = 0; i < pointsAmount; i++) {
        const span = document.createElement('span')
        span.innerHTML = `point ${i + 1}:`
        coordinatesInputsDiv.appendChild(span);

        ['x', 'y'].forEach(placeholder => createCoordinateInput(placeholder))
        const br = document.createElement('br')
        coordinatesInputsDiv.appendChild(br)
    }
})
