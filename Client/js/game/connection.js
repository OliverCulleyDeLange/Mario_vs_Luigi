function connect(host) {
      if ('WebSocket' in window) {
        socket = new WebSocket(host);
      } else if ('MozWebSocket' in window) {
        socket = new MozWebSocket(host);
      } else {
        Console.log('Error: WebSocket is not supported by this browser.');
        return;
      }

      socket.onopen = function () {
          // Socket open.. start the game loop.
          console.log('Info: WebSocket connection opened.');
          setInterval(function() {
              // Prevent server read timeout.
              Game.socket.send('ping');
          }, 5000);
      };

      socket.onclose = function () {
          console.log('Info: WebSocket closed.');
          init();
      };

      socket.onmessage = function (message) {
          // _Potential_ security hole, consider using json lib to parse data in production.
          var packet = eval('(' + message.data + ')');
          switch (packet.type) {
              case 'update':
                  for (var i = 0; i < packet.data.length; i++) {
                      Game.updateSnake(packet.data[i].id, packet.data[i].body);
                  }
                  break;
              case 'join':
                  for (var j = 0; j < packet.data.length; j++) {
                      Game.addSnake(packet.data[j].id, packet.data[j].color);
                  }
                  break;
              case 'leave':
                  Game.removeSnake(packet.id);
                  break;
              case 'dead':
                  console.log('Info: Your snake is dead, bad luck!');
                  Game.direction = 'none';
                  break;
              case 'kill':
                  console.log('Info: Head shot!');
                  break;
              default:
                  console.log("Packet is:" + packet);
                  break;
          }
      };
};