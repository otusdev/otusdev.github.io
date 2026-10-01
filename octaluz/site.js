// A página do Octaluz, em português (/octaluz/) e em inglês (/octaluz/en/):
// o selo da loja, a troca de língua e o resultado de quem mandou o link.
(function () {
  'use strict';

  // Quando o app estiver publicado na Google Play, troque para true: o
  // selo "Em breve" vira o botão da loja, nas duas páginas.
  var PLAY_LIVE = false;

  if (PLAY_LIVE) {
    document.getElementById('play').hidden = false;
    document.getElementById('soon').hidden = true;
  }

  var english = document.documentElement.lang === 'en';
  var text = english ? {
    daily: 'Daily Light',
    best: 'New best',
    point: 'point',
    points: 'points',
    today: 'That’s the score of the person who sent you the link. ' +
      'Today’s challenge is the same for everyone: can you beat it?',
    past: 'That’s the score of the person who sent you the link. ' +
      'Every day brings a new Daily Light: play today’s and share yours.',
    record: 'That’s the best score of the person who sent you the ' +
      'link. Can you beat it?',
    thousands: ','
  } : {
    daily: 'Luz do Dia',
    best: 'Novo recorde',
    point: 'ponto',
    points: 'pontos',
    today: 'Esse foi o resultado de quem te mandou o link. O desafio ' +
      'de hoje é o mesmo para todo mundo: consegue bater?',
    past: 'Esse foi o resultado de quem te mandou o link. Cada dia ' +
      'tem uma Luz do Dia nova: jogue a de hoje e compartilhe a sua.',
    record: 'Esse é o recorde de quem te mandou o link. Consegue bater?',
    thousands: '.'
  };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // A troca de língua leva junto o resultado do link.
  var language = document.getElementById('language');
  if (language && window.location.search) {
    language.search = window.location.search;
  }

  // O app manda o resultado no link: ?d=2026-09-29&p=612 (Luz do Dia)
  // ou ?r=12345 (recorde). Tudo é conferido antes de aparecer e entra
  // na página só como texto.
  var params = new URLSearchParams(window.location.search);

  function points(value) {
    return /^\d{1,7}$/.test(value || '') ? Number(value) : null;
  }

  function day(value) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    if (!m) return null;
    var y = Number(m[1]);
    var mo = Number(m[2]) - 1;
    var d = Number(m[3]);
    var date = new Date(y, mo, d);
    var real = date.getFullYear() === y &&
      date.getMonth() === mo &&
      date.getDate() === d;
    return real ? date : null;
  }

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  // "29/09"; em inglês, "Sep 29". Como no jogo.
  function dayLabel(date) {
    return english
      ? MONTHS[date.getMonth()] + ' ' + date.getDate()
      : pad(date.getDate()) + '/' + pad(date.getMonth() + 1);
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  // 12345 -> "12.345"; em inglês, "12,345". Como no jogo.
  function format(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, text.thousands);
  }

  function show(kind, score, note) {
    document.getElementById('result-kind').textContent = kind;
    document.getElementById('result-points').textContent = format(score);
    document.getElementById('result-unit').textContent =
      score === 1 ? text.point : text.points;
    document.getElementById('result-note').textContent = note;
    document.getElementById('result').hidden = false;
  }

  var daily = day(params.get('d'));
  var dailyPoints = points(params.get('p'));
  var record = points(params.get('r'));

  if (daily && dailyPoints !== null) {
    show(
      text.daily + ' · ' + dayLabel(daily),
      dailyPoints,
      sameDay(daily, new Date()) ? text.today : text.past
    );
  } else if (record !== null) {
    show(text.best, record, text.record);
  }
})();
