function Calendar($calendar,strlanguage){
    this.wrap = $calendar;
    this.days = [];
    this.rows = 5;
    this.lan = strlanguage || 'en';
    this.year = 0;
    this.month = 0;
    this.tempWidth = $('.day_list',this.wrap).width();
    this.duration = 300;
};
Calendar.prototype = {
    //初化
    init : function(){
        var curDate = new Date();
        this.year = curDate.getFullYear();
        this.month = curDate.getMonth();     
        this.update();
    },

    //绑定事件
    bindEvent : function(){
        var _this = this,
            oList = $('.day_list',_this.wrap);
        $('.btn_prev',_this.wrap).on('click',function(){
            _this.goPrev();
        });
        $('.btn_next',_this.wrap).on('click',function(){
            _this.goNext();
        });

        _this._swipe(oList[0],function(){
            _this.goNext()
        },function(){
            _this.goPrev()
        });
    },

    //去上一个月
    goPrev : function(){
        var _this = this;
        $('<ul class="prev_month"></ul>').prependTo('.day_list_inner',_this.wrap);
        $('.day_list_inner',this.wrap).css({
            width : this.tempWidth * 2,
            left : - this.tempWidth
        })
        $('.day_list_inner ul',this.wrap).css({
            width : this.tempWidth
        });

        if(this.month == 0){
            this.render(this.year - 1, 11, $('.prev_month',this.wrap));
            $('.day_list_inner',this.wrap).animate({
                "left" : 0
            },_this.duration,function(){
                $('.cur_month',_this.wrap).remove();
                $('.day_list_inner',_this.wrap).css('left',0);
                $('.prev_month',_this.wrap).attr('class','cur_month');
            });
            this.year = this.year - 1;
            this.month = 11;
        }else{
            this.render(this.year, this.month - 1, $('.prev_month',this.wrap));
            $('.day_list_inner',this.wrap).animate({
                "left" : 0
            },_this.duration,function(){
                $('.cur_month',_this.wrap).remove();
                $('.day_list_inner',_this.wrap).css('left',0);
                $('.prev_month',_this.wrap).attr('class','cur_month');
            });
            this.month = this.month - 1;
        }
    },

    //去下一个月
    goNext : function(){
        var _this = this;
        $('<ul class="next_month"></ul>').appendTo('.day_list_inner',_this.wrap);
        $('.day_list_inner',this.wrap).css({
            width : this.tempWidth * 2
        })
        $('.day_list_inner ul',this.wrap).css({
            width : this.tempWidth
        });

        if(this.month == 11){
            this.render(this.year + 1, 0, $('.next_month',this.wrap));
            $('.day_list_inner',this.wrap).animate({
                "left" : - this.tempWidth
            },_this.duration,function(){
                $('.cur_month',_this.wrap).remove();
                $('.day_list_inner',_this.wrap).css('left',0);
                $('.next_month',_this.wrap).attr('class','cur_month');
            });
            this.year = this.year + 1;
            this.month = 0;
        }else{
            this.render(this.year, this.month + 1, $('.next_month',this.wrap));
            $('.day_list_inner',this.wrap).animate({
                "left" : - this.tempWidth
            },_this.duration,function(){
                $('.cur_month',_this.wrap).remove();
                $('.day_list_inner',_this.wrap).css('left',0);
                $('.next_month',_this.wrap).attr('class','cur_month');
            });
            this.month = this.month + 1;
        }
    },

    update : function(){
        this.render(this.year,this.month,$('.cur_month',this.wrap));
        this.bindEvent();
    },

    //渲染日历
    render : function(year,month,oTarget){
        var _this = this,
            tempCalMain = [];

        //渲染当前月份title
        $('.curMonth',_this.wrap).html(year + '年'+ (month + 1) +'月');

        //渲染日历星期
        if(this.lan == 'zh'){
            var strWeekHd = ['日','一','二','三','四','五','六'];
                tempWeekHd = [];
            for(var i = 0; i < strWeekHd.length; i++){
                tempWeekHd.push('<li>'+ strWeekHd[i] +'</li>');
            }
            _this.wrap.find('.week_hd ul').html(tempWeekHd.join(''));
        }

        //计算日历行数
        this.rows = Math.ceil((this._getDays(year,month) + this._getFirstDay(year,month)) / 7 );

        //渲染日历主体
        for(var i = 0; i < _this.rows; i++){
            tempCalMain.push('<li>');
                for(var k = 0; k < 7; k++){
                    var idx = i * 7 + k,
                        date_str = idx - _this._getFirstDay(year,month) + 1;
                    if(date_str <= 0){
                        tempCalMain.push('<div class="day_item"><span></span></div>');
                    }else if(date_str > _this._getDays(year,month)){
                        tempCalMain.push('<div class="day_item"><span></span></div>');
                    }else{
                        tempCalMain.push('<div class="day_item"><span>'+ date_str +'</span></div>');
                    }
                }
            tempCalMain.push('</li>');
        }
        oTarget.html(tempCalMain.join(''));

        $('.day_list',_this.wrap).css({
            height : $('.day_list li',this.wrap).height() * this.rows
        })
    },

    //处理第一天是周几
    _getFirstDay : function(year,month){
        var n1str = new Date(year,month,1).getDay();
        return n1str;
    },

    //获取某年某月的总天数
    _getDays : function(year,month){
        var temp = [31, 28 + this._is_leap(year), 31, 30, 31, 31, 30, 31, 30, 31, 30, 31];
        return temp[month];
    },
    
    //是否为闰年
    _is_leap : function(year){
        return ( year % 100 == 0 ? res = ( year % 400 == 0 ? 1 : 0) : res = ( year % 4 == 0 ? 1 : 0) );
    },

    //滑动
    _swipe :function(element,fnLeft,fnRight){
        var isTouchMove, startTx, startTy;
        element.addEventListener( 'touchstart', function( e ){
            var touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;
            isTouchMove = false;
        }, false );
        element.addEventListener( 'touchmove', function( e ){
            isTouchMove = true;
        }, false );
        element.addEventListener( 'touchend', function( e ){
            if( !isTouchMove ){
                return;
            }
            var touches = e.changedTouches[0],
            endTx = touches.clientX,
            endTy = touches.clientY,
            distanceX = startTx - endTx
            distanceY = startTy - endTy,
            isSwipe = false;
            if( Math.abs(distanceX) >= Math.abs(distanceY)){
                if( distanceX > 20  ){
                    //向左滑动
                    e.preventDefault();
                    fnLeft();
                }else if( distanceX < -20 ){
                    //向又滑动
                    e.preventDefault();
                    fnRight();
                }
                if(distanceX){
                    e.preventDefault();
                }
                isSwipe = true;
            }
        }, false );	
    }
}