document.addEventListener('DOMContentLoaded', function () {
    const pointsList = document.getElementById('points-list');
    const xPointInput = document.getElementById('x-point');
    const yPointInput = document.getElementById('y-point');
    const addPointButton = document.getElementById('add-point');
    const interpolationForm = document.getElementById('interpolation-form');
    let points = [];

    addPointButton.addEventListener('click', function () {
        const x = parseFloat(xPointInput.value);
        const y = parseFloat(yPointInput.value);

        if (!isNaN(x) && !isNaN(y)) {
            points.push({ x, y });
            const listItem = document.createElement('li');
            listItem.textContent = `(${x}, ${y})`;
            pointsList.appendChild(listItem);

            xPointInput.value = '';
            yPointInput.value = '';
        }
    });

    interpolationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const method = document.getElementById('method').value;
        const xValue = parseFloat(document.getElementById('x-value').value);

        let result;
        if (method === 'lagrange') {
            result = lagrangeInterpolation(points, xValue);
        } else {
            result = newtonInterpolation(points, xValue);
        }

        document.getElementById('result').textContent = `Valor interpolado em x = ${xValue}: ${result.toFixed(2)}`;
    });

    function lagrangeInterpolation(points, x) {
        let n = points.length;
        let P_x = 0;

        for (let i = 0; i < n; i++) {
            let L_i = 1;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    L_i *= (x - points[j].x) / (points[i].x - points[j].x);
                }
            }
            P_x += L_i * points[i].y;
        }

        return P_x;
    }

    function newtonInterpolation(points, x) {
        let n = points.length;
        let dividedDiff = Array.from({ length: n }, (_, i) => [points[i].y]);

        for (let j = 1; j < n; j++) {
            for (let i = 0; i < n - j; i++) {
                dividedDiff[i][j] = (dividedDiff[i + 1][j - 1] - dividedDiff[i][j - 1]) / (points[i + j].x - points[i].x);
            }
        }

        let P_x = dividedDiff[0][0];
        for (let j = 1; j < n; j++) {
            let term = dividedDiff[0][j];
            for (let k = 0; k < j; k++) {
                term *= (x - points[k].x);
            }
            P_x += term;
        }

        return P_x;
    }
});
