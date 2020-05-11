/**
 *
 * Author : MD. Sheik Mohideen K.H
 *
 *
 *
 */
;
(function($, window, undefined) {

  $.nsWindow = {

    name: 'nsWindow',

    version: '1.0',

    window: null,

    options: null,

    bind: function(type, callback) {
      $(document).bind(type, callback);
      return this;
    },

    unbind: function(type) {
      $(document).unbind(type);
      return this;
    },

    open: function(options) {

      this.options = $.extend(true, {
        title: 'Untitled',
        top: 0,
        left: 0,
        width: 500,
        height: 500,
        useOverlay: true,
        animate: true,
        showControlBar: true,
        titleBarHeight: 0,
        closable: true,
        movable: true,
        resizable: false,
        overlay: {
          background: '#000',
          opacity: .60,
          zIndex: 1000,
          clickToClose: true,
          destroyOnClose: false
        },
        dataUrl: null,
        data: null,
        theme: 'yellow',
        loadingMessage: 'Loading...',
        onDataLoaded: null
      }, options);

      var opt = this.options, self = this;

      this.bind($.nsWindowEvent.onOpen, _openAndCloseHandler).bind($.nsWindowEvent.onClose, _openAndCloseHandler);

      var body = $(document.body);

      if (body.find('> .nswindowOverlay, > .nswindowContainer').length > 0) {
        body.find('> .nswindowOverlay, > .nswindowContainer').show();
        this.window = $('.nswindowContainer #nswindow').get(0);
      } else {
        var pg = _createOverlay(opt, body);
        this.window = $('<div>').attr('id', 'nswindow').get(0);
        pg.append(this.window);
      }

      var t = '';
      if (opt.showControlBar == true) {
        t = '<div id="ctrlbar" class="controlbar"><div class="title">' + opt.title + '</div>';
        if (_isEmpty(opt.closable) || opt.closable == true) {
          t += '<a class="close" title="close" href="javascript:void(0)"></a>';
        }
        t += '</div>';
      }
      t += '<div id="nswindowContent">&nbsp;</div>';

      $(this.window).addClass(opt.theme).html(t);

      var w = parseInt($(this.window).css('width')), h = parseInt($(this.window).css('height'))

      // Get width & height from css.
      this.options.width = (_isEmpty(this.options.width) && w > 0) ? w : this.options.width;
      this.options.height = (_isEmpty(this.options.height) && h > 0) ? h : this.options.height;
      //alert(w);

      if (opt.showControlBar == true) {
        var ctrlbar = $('.controlbar', this.window);
        if (opt.titleBarHeight == 0) {
          opt.titleBarHeight = parseInt(ctrlbar.css('height'));
        } else {
          ctrlbar.css('height', opt.titleBarHeight + 'px');
        }

        $('#nswindowContent', this.window).css('top', (opt.titleBarHeight + 1) + 'px');

        $('.title', this.window).css({
          marginTop: (opt.titleBarHeight / 2 - 8) + 'px'
        })
      }

      $('.close', this.window).click(function() {
        self.close();
        return false;
      });

      _trigger.call(this, $.nsWindowEvent.onOpen);
      return this;
    },

    close: function(option) {
      var me = this;
      var o = $.extend({
        delay: 0
      }, option);

      if (o.delay > 0) {
        setTimeout(_t, o.delay);
      } else {
        _t();
      }

      function _t() {
        _trigger.call(me, $.nsWindowEvent.onClose);
      }

    },

    loadData: function(url) {
      this.showLoading(this.options.loadingMessage);
      var me = this;
      alert(url);
      $.ajax({
        url: url,
        dataType: 'html',
        success: function(data) {
          $('#nswindowContent', me.window).html(data);
          if (typeof me.options.onDataLoaded == 'function') {
            me.options.onDataLoaded.call(me);
          }
        }
      })
    },

    setHtml: function(html) {
      $('#nswindowContent', this.window).html(html);
    },

    showLoading: function(msg, clearContainer) {
      msg = _isEmpty(msg) ? this.options.loadingMessage : msg;
      clearContainer = _isEmpty(clearContainer) ? false : clearContainer;
      _showLoading(this.window, msg, clearContainer);
    }
  }

  //-------------------------------------------------------------------------------------//

  $.nsWindowEvent = {
    onOpen: $.nsWindow.name + 'OnOpen',
    onClose: $.nsWindow.name + 'OnClose'
  }

  //-------------------------------------------------------------------------------------//

  function _trigger(type) {
    that = this;
    $(document).trigger(jQuery.Event(type, {
      context: that,
      window: that.window,
      dataContainer: $('#nswindowContent', that.window).get(0),
      options: that.options
    }));
  }

  //-------------------------------------------------------------------------------------//

  function _createOverlay(opt, body) {
    var overlay = opt.overlay;
    if (opt.useOverlay == true) {
      $('<div>').addClass('nswindowOverlay').html('&nbsp;').css({
        opacity: overlay.opacity,
        filter: 'alpha(opacity=' + (overlay.opacity * 100) + ')',
        background: overlay.background,
        zIndex: overlay.zIndex
      }).appendTo(body);
    }

    var pg = $('<div>');
    if (overlay.clickToClose) {
      pg.click(function(event) {
        if (!event.isDefaultPrevented() && event.target == this) {
          $.nsWindow.close();
        }
      })
    }

    pg.addClass('nswindowContainer').css({
      zIndex: overlay.zIndex + 10
    });

    body.append(pg);

    return pg;
  }

  //-------------------------------------------------------------------------------------//

  function _closeWindow(event) {
    var body = $(document.body);

    if (event.options.overlay.destroyOnClose) {
      body.find('.nswindowOverlay,.nswindowContainer').remove();
    } else {
      $(event.window).removeAttr('style').removeAttr('class').html('');
      body.find('.nswindowOverlay,.nswindowContainer').hide();
    }
  }

  //-------------------------------------------------------------------------------------//

  function _showLoading(win, msg, clearContainer) {
    var w = $('#nswindowContent', win);
    $('.loader', win).remove();
    if (clearContainer == true) {
      w.html('')
    }
    w.append('<div class="loader" align="center">' + msg + '</div>');
  }

  //-------------------------------------------------------------------------------------//

  function _openAndCloseHandler(event) {
    if (typeof event != 'undefined' && event.isDefaultPrevented()) {
      return;
    }

    var opt = event.options, win = $(event.window);

    var tw = opt.width / 8, th = opt.height / 8;

    opt.left = opt.left == 0 ? $(window).width() / 2 - opt.width / 2 : opt.left;
    opt.top = opt.top == 0 ? $(window).height() / 2 - opt.height / 2 : opt.top;

    var css1 = {
      width: tw + 'px',
      height: th + 'px',
      left: (opt.left + tw * 3.5) + 'px',
      top: (opt.top + th * 3.5) + 'px',
      opacity: 0.0
    }, css2 = {
      left: opt.left + 'px',
      top: opt.top + 'px',
      width: opt.width + 'px',
      height: opt.height + 'px',
      opacity: 1.0
    }

    if (event.type == $.nsWindowEvent.onOpen) {
      if (opt.animate == true) {
        win.css(css1).stop().animate(css2, {
          duration: 300,
          easing: 'easeOutBack',
          complete: function(e) {
            _configWindow(event);
          }
        });
      } else {
        win.css(css2);
        _configWindow(event);
      }

    } else {
      if (opt.animate == true) {
        win.stop().animate(css1, {
          duration: 300,
          easing: 'easeOutBack',
          complete: function() {
            opt.left = 0;
            opt.top = 0;
            _closeWindow(event);
          }
        });
      } else {
        _closeWindow(event);
      }
      //$.nsWindow.unbind($.nsWindowEvent.onOpen).unbind($.nsWindowEvent.onClose);
    }
  }

  //-------------------------------------------------------------------------------------//

  function _configWindow(event) {
    var opt = event.options, win = $(event.window);

    /*
     if ($.browser.msie) {
     $(event.dataContainer).css({
     width: (opt.width - 12) + 'px',
     height: (opt.height - opt.titleBarHeight - 7) + 'px'
     })
     }
     */

    if(opt.onOpen) {
      opt.onOpen.call(event.context);
    }
    if (!_isEmpty(opt.dataUrl)) {
      event.context.loadData.call(event.context, opt.dataUrl);
    }

    if (opt.movable && opt.movable == true) {
      win.draggable({
        handle: ".controlbar"
      });
    }
    if (opt.resizable && opt.resizable == true) {
      win.resizable();
    }

  }

  //-------------------------------------------------------------------------------------//

  function _isEmpty(value) {
    return typeof value == 'undefined' || value == null || value == 'null' || $.trim(value) == ''
  }

  //-------------------------------------------------------------------------------------//

  function _log(msg) {
    //console.log(msg);
  }

})(jQuery, window);
