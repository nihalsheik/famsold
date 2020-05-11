/**
 * Created by sheik on 03-10-2015.
 */

$(document).ready(function() {

  $('table.test tr.suiteRow').click(showOrHide);
  $('table.test tr.testRow').click(showDetail);
  $('.statsWidget .selector').click(filter);

  $('#btnExpand').click(expandAll);
  $('#btnCollapse').click(collapseAll);

});

function collapseAll() {
  $('#testTable .testRow').addClass('hideRow');
}

function expandAll() {
  $('#testTable .testRow').removeClass('hideRow');
}

function showOrHide() {
  e = $(this);
  if(e.hasClass('collapsed')) {
    e.removeClass('collapsed');
  } else {
    e.addClass('collapsed');
  }

  while (true) {
    e = e.next();
    if (e.length == 0 || e.hasClass('suiteRow')) {
      break;
    }
    if (e.hasClass('hideRow')) {
      e.removeClass('hideRow');
    } else {
      e.addClass('hideRow');
    }

  }
}

function filter() {
  var e = $(this);
  var selected = e.hasClass('selected');

  var p = e.parent();
  var cls = '';
  if (p.hasClass('widgetPasses')) {
    cls = 'passed';
  } else if (p.hasClass('widgetPending')) {
    cls = 'pending';
  } else if (p.hasClass('widgetFailures')) {
    cls = 'failed';
  }

  if (selected) {
    e.removeClass('selected');
    $('.testRow.' + cls).addClass('hideRow');
  } else {
    e.addClass('selected');
    $('.testRow.' + cls).removeClass('hideRow');
    $('.suiteRow').removeClass('hideRow');
  }

  var row = 0;
  var prevSuite = null;
  $('#testTable tr').each(function() {
    var e = $(this);
    if (e.hasClass('suiteRow')) {
      if (prevSuite != null && row == 0) {
        $(prevSuite).addClass('hideRow');
      }
      prevSuite = this;
      row = 0;
    } else if (!e.hasClass('hideRow')) {
      row = 1;
    }
  });
}

function showDetail() {
  var id = $(this).attr('data-id');
  $.nsWindow.open({
    title: 'Detail',
    width: 800,
    height: 600,
    top: 100,
    movable: false,
    resizable: false,
    theme: 'skyblue',
    overlay: {
      opacity: 0.60
    },
    onOpen: function() {
      this.showLoading();
      $.ajax({
        url: '/api/v1/test/getDetail?id=' + id,
        dataType: 'json',
        success: function(data) {
          var container = $('#nswindowContent');
          container.html('<div id="jsoneditor"></div>');
          var jsoneditor = document.getElementById('jsoneditor');
          var options = {
            mode: 'code',
            modes: ['code', 'form', 'text', 'tree', 'view'],
            error: function(err) {
              alert(err.toString());
            }
          };
          var editor = new JSONEditor(jsoneditor, options, data);
        }
      });

    }
  });

}