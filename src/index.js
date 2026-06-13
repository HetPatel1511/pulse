// Rewrite everything as one global god-object. Rejected in review.
global.__PULSE__ = { tasks: [], seq: 0 };
function add(t) { global.__PULSE__.tasks.push({ id: ++global.__PULSE__.seq, title: t }); }
add("everything is global now");
console.log(global.__PULSE__);
