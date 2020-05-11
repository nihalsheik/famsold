$(document).ready(function() {

  $.ajax({
    url: 'http://localhost:3000/api/v1/report/trialBalance',
    contentType: 'json'
  }).done(function(res) {
    alert(res);
  });

  function addNode(children, pid, isEtx) {

    if (!children || children.length == 0) return '';

    var nodeType = isEtx ? 'etx' : children[0].type;
    var ul = $('<ul id="p-' + pid + '" class="' + nodeType + '">');

    if (nodeType == 'root' || nodeType == 'outdoor') {
      ul.css('display', 'block');
    } else {
      ul.css('display', 'block');
    }

    children.forEach(function(node) {
      var cui = '', clen = 0;
      if (node.etx && node.etx.length > 0) {
        cui = addNode(node.etx, node.id, true);
        clen = node.etx.length;
      } else {
        cui = addNode(node.children, node.id, false);
        clen = node.children ? node.children.length : 0;
      }
      var li = $('<li>').attr('id', node.id);
      if (!isEtx) {
        li.append('<div class="arrow expand">');
      }
      li.append('<input class="selector" type="checkbox">');
      var name = $('<div class="name">').append(node.name);
      if (clen > 0) {
        name.append('&nbsp;&nbsp;&nbsp;(' + (clen) + ')');
      }
      li.append(name).append(cui);
      ul.append(li);
    });
    return ul;
  }

  function init() {
    $('.selector').click(function(e) {
      e = $(this);
      if (e.prop('checked') == true) {
        e.parent().find('.selector').prop('checked', true);
      } else {
        e.parent().find('.selector').prop('checked', false);
      }
    });

    $('.arrow').click(function(e) {
      e = $(this);
      $('#p-' + e.parent().attr('id')).toggle();
      if (e.hasClass('expand')) {
        e.removeClass('expand').addClass('collapse');
      } else {
        e.removeClass('collapse').addClass('expand');
      }
    });
  }

});