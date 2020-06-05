// el 转盘dom
// initSpeed 初始速度
// accelerate 加速度
// maxSpeed 加速时最大速度
// minSpeed 减速时最小速度
// areaNumber 分为几块

function Lottery(el, initSpeed, accelerate, maxSpeed, minSpeed, areaNumber) {
    let reId;
    let startTime = null;
    this.el = el;
    this.speed = initSpeed;
    this.accelerate = accelerate;
    this.maxSpeed = maxSpeed;
    this.minSpeed = minSpeed;
    this.areaNumber = areaNumber;
    this.singleAngle = 360 / this.areaNumber;
    this.rotateAngle = 0;
    this.endAngle = null;
    let flag = 0;  // 0 加速; 1减速； 2停止;
    const _this = this;

    this.getAccSpeed = function() {
        this.speed = this.speed + this.accelerate;
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
       
        return this.speed;
    }

    this.getSlowSpeed = function() {
        this.speed = this.speed - this.accelerate;
        if (this.speed < this.minSpeed) {
            this.speed = this.minSpeed;
        }
       
        return this.speed;
    }

    this.step = function(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const st = window.getComputedStyle(el, null);
        const tr =  st.getPropertyValue("-webkit-transform") ||
                    st.getPropertyValue("-moz-transform") ||
                    st.getPropertyValue("-ms-transform") ||
                    st.getPropertyValue("-o-transform") ||
                    st.getPropertyValue("transform") ||
                    "fail...";
        let values = tr.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');
        const a = values[0];
        const b = values[1];
        const c = values[2];
        const d = values[3];
        const angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
        _this.rotateAngle = angle;

        setTimeout(() => {
            flag = 1;
        }, 5000);

        if (flag === 0) {
            _this.quicker();
            console.log('_this.rotateAngle', _this.rotateAngle);
        }
        if (flag === 1) {
            _this.slower();
            console.log('_this.rotateAngle', _this.rotateAngle, _this.endAngle);
            if (Math.abs(_this.rotateAngle - _this.endAngle) < 1 && _this.speed === _this.minSpeed) {
                _this.rotateAngle = _this.endAngle;
                el.style.transform = 'translate(-50%, -50%) rotate('+ _this.rotateAngle +'deg)';
                return this.stop();
            }
        }

        if (flag === 2) {
            return _this.stop();
        }

        el.style.transform = 'translate(-50%, -50%) rotate('+ _this.rotateAngle +'deg)';
        reId = requestAnimationFrame(_this.step);
    }

    this.run = function() {
        if (!reId) {
            requestAnimationFrame(_this.step);
        }
    }

    this.stop = function() {
        if (reId) {
            reId = null;
            startTime = null;
            this.el = el;
            this.speed = initSpeed;
            this.accelerate = accelerate;
            this.maxSpeed = maxSpeed;
            cancelAnimationFrame(reId);
        }
    }

    this.setResult = function(index) {
        this.endAngle = index * this.singleAngle;
        if (this.endAngle > 180) {
            this.endAngle = this.endAngle - 360;
        }
    }

    this.quicker = function() {
        this.rotateAngle = this.rotateAngle + this.getAccSpeed();
        if (this.rotateAngle > 180) {
            this.rotateAngle = this.rotateAngle - 360;
        }
    }

    this.slower = function() {
        this.rotateAngle = this.rotateAngle + this.getSlowSpeed();
        if (this.rotateAngle > 180) {
            this.rotateAngle = this.rotateAngle - 360;
        }
    }
}