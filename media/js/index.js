var RULELOGIC = {
    "Rock": ["Scissors", "Lizard"],
    "Paper": ["Rock", "Spock"],
    "Scissors": ["Paper", "Lizard"],
    "Lizard": ["Paper", "Spock"],
    "Spock": ["Scissors", "Rock"]
};

var socket = io.connect('');
socket.on('winners_list', function (data) {
    $('#winnersModal  .table tbody').empty();
    $.each(data, function (i, player) {
        $('#winnersModal  .table tbody').append('<tr><td>' + player.name + '</td><td>' + player.score + '</td></tr>');
    });
});

$('#winnersModal').on('show.bs.modal', function (e) {
    socket.emit('get_winners');
});

if (localStorage.recent_name) {
    $('#name').val(localStorage.recent_name);
}

function result() {
    var player1 = $('.hands .active1').data('player_name');
    var player2 = $('.hands .active2').data('player_name');
    var hand1 = $('.hands .active1').data('type');
    var hand2 = $('.hands .active2').data('type');

    $('.results').empty();
    $('.results').append('<h3>' + player1 + ' choose: ' + hand1 + '</h3>')
    $('.results').append('<h3>' + player2 + ' choose: ' + hand2 + '</h3>');

    if (hand1 == hand2) {
        $('.results').append('<h2>It\'s a tie!</h2>');
    } else if (RULELOGIC[hand1].indexOf(hand2) != -1) {
        $('.results').append('<h2>' + player1 + ' Wins This Round</h2>');
        socket.emit('set_winner', {name: player1});
    } else {
        $('.results').append('<h2>' + player2 + ' Wins This Round</h2>');
        socket.emit('set_winner', {name: player2});
    }
}

function play(hand, name, cls) {
    var random = Math.floor(Math.random() * $(".hands img:visible").size());

    (hand ? $(hand) : $(".hands img:visible").eq(random)).addClass(cls).data('player_name', name);

    if (cls == 'active2') {
        result();
    }
}

$('#start_computer').on('click', function () {
    $('.start').hide();
    $('.game').show();
    $('.navbar-nav li').show();
    $('.extended_hands').toggle($('#extended').is(':checked'));

    play(null, 'Computer', 'active1');

    setTimeout(function () {
        play(null, 'Computer(2)', 'active2');
    }, 2000);
});

$('#nameModal form').on('submit', function (e) {
    e.preventDefault();

    if ($('#name').val()) {
        $('#nameModal').modal('hide');

        localStorage.recent_name = $('#name').val();

        $('.start').hide();
        $('.game').show();
        $('.navbar-nav li').show();
        $('.extended_hands').toggle($('#extended').is(':checked'));

        $('.hands img:visible').on('click', function () {
            $('.hands img:visible').unbind('click');

            play(this, localStorage.recent_name, 'active1');

            setTimeout(function () {
                play(null, 'Computer', 'active2');
            }, 2000);
        });
    }
});