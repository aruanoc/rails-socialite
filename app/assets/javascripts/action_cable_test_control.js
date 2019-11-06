(function($){

  var globals = {
    parent_div_id: ''
  };

  var settings = {};

  var methods = {
    init: function(setting_override){
      $.extend(settings, setting_override);

      globals.parent_div_id = $(this).attr('id');

      $(settings.test_btn_id).click(methods.test_btn_click);

      methods.subscribeToRsControlChannel();
    },
    test_btn_click: function() {
      $.ajax({
        type: 'POST',
        url: '/action_cable_test_broadcast',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
        },
        success: function (data, textStatus, jqXHR) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
      });
    },
    subscribeToRsControlChannel: function() {
      App.rsControlChannel = App.cable.subscriptions.create({
        channel: "RsControlChannel"
      }, {
        connected: function() {},
        disconnected: function() {},
        received: function(data) {
          switch(data['type']) {
            case 'RS-Test-Message':
              $(settings.message_holder_id).text(data['message']);
              $(settings.message_holder_id).css('color', 'green').css('font-weight', 'bold');
              break;
          }
        },
        broadcastMessage: function(data) {
          this.perform('broadcast_from_client', data);
        }
      });
    }
  };

  return $.fn.action_cable_test_control = function(method){
    if (methods[method]){
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof(method) === "object" || !method){
      methods.init.apply(this, arguments);
    } else {
      return $.error("Method " + method + " does not exist on jQuery.action_cable_test_control");
    };
  };

})(jQuery);