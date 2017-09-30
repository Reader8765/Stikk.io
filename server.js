var http = require('http');
var fs = require('fs');
var pp = [[27, -32], [27, -32], [28, -31], [28, -31], [29, -30], [30, -30], [30, -29], [31, -28], [31, -28], [32, -27], [32, -27], [32, -26], [33, -26], [33, -25], [34, -24], [34, -24], [35, -23], [35, -23], [35, -22], [36, -21], [36, -21], [37, -20], [37, -19], [37, -19], [38, -18], [38, -17], [38, -17], [39, -16], [39, -15], [39, -15], [39, -14], [40, -13], [40, -13], [40, -12], [40, -11], [40, -10], [41, -10], [41, -9], [41, -8], [41, -8], [41, -7], [41, -6], [42, -5], [42, -5], [42, -4], [42, -3], [42, -2], [42, -2], [42, -1], [42, 0], [42, 0], [42, 0], [42, 1], [42, 2], [42, 2], [42, 3], [42, 4], [42, 5], [42, 5], [41, 6], [41, 7], [41, 8], [41, 8], [41, 9], [41, 10], [40, 10], [40, 11], [40, 12], [40, 13], [40, 13], [39, 14], [39, 15], [39, 15], [39, 16], [38, 17], [38, 17], [38, 18], [37, 19], [37, 19], [37, 20], [36, 21], [36, 21], [35, 22], [35, 23], [35, 23], [34, 24], [34, 24], [33, 25], [33, 26], [32, 26], [32, 27], [32, 27], [31, 28], [31, 28], [30, 29], [30, 30], [29, 30], [28, 31], [28, 31], [27, 32], [27, 32], [26, -32]];
var server = http.createServer(function (req, res) {
		fs.readFile('./index.html', 'utf-8', function (error, content) {
			res.writeHead(200, {
				"Content-Type": "text/html"
			});
			res.end(content);
		});
	});
redirectToUpdate = function () {
	update();
}
function intersectRect(r1, r2) {
	return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}
function int(n) {
	return Math.floor(n);
};
function intersectPoint(p, r) {
	return ((p[0] < r.right) && (p[0] > r.left) && (p[1] < r.bottom) && (p[1] > r.top))
}
update = function () {
	spi = []
	for (player of players) {
		player.anim = Math.round(player.attackdel / 10);
		//player.anim=int(Math.max(Math.min(player.direction+45,101),0))
		xm = (player.speed / 10) * player.actspeed * Math.cos(player.direction * Math.PI / 180);
		ym = (player.speed / 10) * player.actspeed * Math.sin(player.direction * Math.PI / 180);
		donef = []
		for (f of player.effects) {
			if (f[0] == 0) {
				player.attackdel = 0;
				xm = 0;
				ym = 0;
			}
			f[1] -= 1
			if (f[1] < 1) {
				donef.push(f);
			}
		}
		for (f of donef) {
			index = player.effects.indexOf(f);
			player.effects.splice(index, 1);
		}
		if (!(!player.attacking && player.attackdel == 0)) {
			player.attackdel += player.attackspeed;
			for (op of players) {
				if ((op != player) && !player.hasHit.includes(op)) {
					hh = pp[player.anim];
					if (player.facing == "right") {
						p = [hh[0] + player.pos[0], hh[1] + player.pos[1]];
					} else {
						p = [player.pos[0] - hh[0], hh[1] + player.pos[1]];
					}
					inter1 = intersectPoint(p, op.rect);
					if (player.weapon) {
						usa = player.anim + 40;
						if (player.facing == "right") {
							pos = rotate_point(player.pos[0], -40 + player.pos[1] - player.weapon.len, player.pos[0], player.pos[1], usa)
						} else {
							pos = rotate_point(player.pos[0], -40 + player.pos[1] - player.weapon.len, player.pos[0], player.pos[1], -usa)
						}
						inter2 = intersectPoint([pos.x, pos.y], op.rect);
						if (!inter2 && player.weapon.len >= 80) {
							usa = player.anim + 40;
							if (player.facing == "right") {
								pos = rotate_point(player.pos[0], -40 + player.pos[1] - (player.weapon.len / 2), player.pos[0], player.pos[1], usa)
							} else {
								pos = rotate_point(player.pos[0], -40 + player.pos[1] - (player.weapon.len / 2), player.pos[0], player.pos[1], -usa)
							}
							inter2 = intersectPoint([pos.x, pos.y], op.rect);
						}
					} else {
						inter2 = false
					};
					if (inter1 || inter2) {
						doDamage(player, op);
					}
				}
			}
			for (ob of obs) {
				if (!player.hasHit.includes(ob)) {
					hh = pp[player.anim];
					if (player.facing == "right") {
						p = [hh[0] + player.pos[0], hh[1] + player.pos[1]];
					} else {
						p = [player.pos[0] - hh[0], hh[1] + player.pos[1]];
					}
					inter1 = intersectPoint(p, ob.rect);
					if (player.weapon) {
						usa = player.anim + 40;
						if (player.facing == "right") {
							pos = rotate_point(player.pos[0], -40 + player.pos[1] - player.weapon.len, player.pos[0], player.pos[1], usa)
						} else {
							pos = rotate_point(player.pos[0], -40 + player.pos[1] - player.weapon.len, player.pos[0], player.pos[1], -usa)
						}
						inter2 = intersectPoint([pos.x, pos.y], ob.rect);
						if (!inter2 && player.weapon.len >= 80) {
							usa = player.anim + 40;
							if (player.facing == "right") {
								pos = rotate_point(player.pos[0], -40 + player.pos[1] - (player.weapon.len / 2), player.pos[0], player.pos[1], usa)
							} else {
								pos = rotate_point(player.pos[0], -40 + player.pos[1] - (player.weapon.len / 2), player.pos[0], player.pos[1], -usa)
							}
							inter2 = intersectPoint([pos.x, pos.y], ob.rect);
						}
					} else {
						inter2 = false
					};
					if (inter2 || inter1) {
						player.hasHit.push(ob);
						ob.health -= player.damage;
						if (ob.health <= 0) {
							oldt = ob.type;
							if (oldt == 1) {
								nx = Math.floor((Math.random() * maplimitx));
								ny = Math.floor((Math.random() * maplimity));
								nob = {
									pos: [nx, ny]
								};
								nob.money = 1;
								nob.health = 50;
								nob.type = 1;
								nob.rect = {
									top: nob.pos[1] - 33,
									bottom: nob.pos[1] + 33,
									left: nob.pos[0] - 33,
									right: nob.pos[0] + 33,
								};
								nob.id = Math.random();
								obs.push(nob);
							}
							if (oldt == 2) {
								nx = Math.floor((Math.random() * maplimitx));
								ny = Math.floor((Math.random() * maplimity));
								nob = {
									pos: [nx, ny]
								};
								nob.money = 3;
								nob.health = 150;
								nob.type = 2;
								nob.id = Math.random();
								nob.rect = {
									top: nob.pos[1] - 33,
									bottom: nob.pos[1] + 33,
									left: nob.pos[0] - 33,
									right: nob.pos[0] + 33,
								};
								obs.push(nob);
							}
							if (oldt == 3) {
								nx = Math.floor((Math.random() * maplimitx));
								ny = Math.floor((Math.random() * maplimity));
								nob = {
									pos: [nx, ny]
								};
								nob.money = 9;
								nob.health = 450;
								nob.type = 3;
								nob.id = Math.random();
								nob.rect = {
									top: nob.pos[1] - 33,
									bottom: nob.pos[1] + 33,
									left: nob.pos[0] - 33,
									right: nob.pos[0] + 33,
								};
								obs.push(nob);
							}
							if (oldt == 4) {
								nx = Math.floor((Math.random() * maplimitx));
								ny = Math.floor((Math.random() * maplimity));
								nob = {
									pos: [nx, ny]
								};
								nob.money = 27;
								nob.health = 1350;
								nob.type = 4;
								nob.id = Math.random();
								nob.rect = {
									top: nob.pos[1] - 33,
									bottom: nob.pos[1] + 33,
									left: nob.pos[0] - 33,
									right: nob.pos[0] + 33,
								};
								obs.push(nob);
							}
							io.emit("newshape", {
								news: nob,
								rem: ob.id
							})
							player.money += ob.money;
							calcStats(player);
							index = obs.indexOf(ob);
							obs.splice(index, 1);
						} else {
							io.emit("shapechange", {
								shape: ob.id,
								newp: ob.health
							});
						}
					}
				}
			}
			if (player.attackdel >= 1000) {
				player.attackdel = 0;
				player.hasHit = [];
			}
		} else {}
		player.pos[0] += xm;
		for (op of players) {
			if (op != player) {
				dx = player.pos[0] - op.pos[0];
				dy = player.pos[1] - op.pos[1];
				if (Math.abs(dx) < ppminx && Math.abs(dy) < ppminy) {
					if (dx < 0) {
						player.pos[0] += (Math.abs(dx) - ppminx);
					} else {
						player.pos[0] -= (Math.abs(dx) - ppminx);
					}
				}
			}
		}
		for (ob of obs) {
			dx = player.pos[0] - ob.pos[0];
			dy = player.pos[1] - ob.pos[1];
			if (Math.abs(dx) < pominx && Math.abs(dy) < pominy) {
				if (dx < 0) {
					player.pos[0] += (Math.abs(dx) - pominx);
				} else {
					player.pos[0] -= (Math.abs(dx) - pominx);
				}
			}
		}
		player.pos[1] += ym;
		for (op of players) {
			if (op != player) {
				dx = player.pos[0] - op.pos[0];
				dy = player.pos[1] - op.pos[1];
				if (Math.abs(dx) < ppminx && Math.abs(dy) < ppminy) {
					if (dy < 0) {
						player.pos[1] += (Math.abs(dy) - ppminy);
					} else {
						player.pos[1] -= (Math.abs(dy) - ppminy);
					}
				}
			}
		}
		for (ob of obs) {
			dx = player.pos[0] - ob.pos[0];
			dy = player.pos[1] - ob.pos[1];
			if (Math.abs(dx) < pominx && Math.abs(dy) < pominy) {
				if (dy < 0) {
					player.pos[1] += (Math.abs(dy) - pominy);
				} else {
					player.pos[1] -= (Math.abs(dy) - pominy);
				}
			}
		}
		player.rect = {
			top: player.pos[1] - 96,
			bottom: player.pos[1] + 96,
			left: player.pos[0] - 40,
			right: player.pos[0] + 40,
		};
		spi.push([player.id, player.pos, player.facing, player.anim]);
		player.emit('you', [player.pos, player.money, player.helmet, player.chest, player.boots, player.weapon]);
		if (player.chealth <= 0) {
			kill(player, op)
		}
		if (player.pos[0] > maplimitx - 40) {
			player.pos[0] = maplimitx - 40
		}
		if (player.pos[1] > maplimity - 96) {
			player.pos[1] = maplimity - 96
		}
		if (player.pos[0] < 40) {
			player.pos[0] = 40
		}
		if (player.pos[1] < 96) {
			player.pos[1] = 96
		}
		if (player.rt <= 0) {
			if (player.rdelay >= 1000) {
				player.rdelay = 0;
				if (player.chealth < player.mhealth) {
					player.chealth += 1;
					io.emit("healthchange", [player.id, player.chealth])
				}
			}
			player.rdelay += player.regen;
		} else {
			player.rt -= 1
		};
		if (player.chealth > player.mhealth) {
			player.chealth = player.mhealth;
		}
	}
	io.emit("update", spi);
	return spi;
}
function rotate_point(pointX, pointY, originX, originY, angle) {
	angle = angle * Math.PI / 180.0;
	return {
		x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
		y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
	};
}
function doDamage(player, op) {
	player.hasHit.push(op);
	op.ld = player.id;
	d = Math.max(player.damage - (Math.max(op.armor - player.armorp, 0)), 0);
	op.chealth -= d;
	op.rt = 2000;
	io.emit("healthchange", [op.id, op.chealth])
	for (mine of[player.helmet, player.chest, player.boots, player.weapon]) {
		if (mine) {
			un = mine.name.replace(/\s+/g, '')
				if (onHit.hasOwnProperty(un)) {
					onHit[un](player, op);
				}
		}
	}
}
ff = function (rid) {
	if (rid) {
		for (r of rjoin) {
			if (r[0] == rid) {
				index = players.indexOf(r);
				rjoin.splice(index, 1);
			}
		}
	}
}
function kill(dead) {
	calcStats(dead);
	index = players.indexOf(dead);
	players.splice(index, 1);
	for (var player of players) {
		if (player.id == dead.ld) {
			killer = player
		}
	}
	killer.money += int(dead.value / 2);
	rdid = Math.random();
	r = [rdid, int(dead.value / 2), 0];
	rjoin.push(r);
	console.log(dead.name + " has been killed by " + killer.name + ". They had " + dead.value + " value, so they will start with " + r[1] + " money.");
	dead.emit("Dead", [killer.name, [r[0], r[1]]]);
	calcStats(killer);
	calcLeaderboard();
	every = [];
	for (player of players) {
		every.push({
			id: player.id,
			effects: player.effects,
			dt: player.dt,
			facing: player.facing,
			name: player.name,
			pos: player.pos,
			mhealth: player.mhealth,
			chealth: player.chealth,
			anim: player.anim,
			helmet: player.helmet.name,
			chest: player.chest.name,
			boots: player.boots.name,
			weapon: player.weapon.name
		});
	}
	io.emit("allplayers", every);
}
function calcLeaderboard() {
	topNum = 3
		leaders = players.slice();
	leaders.sort(function (a, b) {
		return a.value - b.value;
	})
	leaders = leaders.slice(Math.max(leaders.length - topNum, 0))
		leaders.reverse();
	leadd = [];
	for (l of leaders) {
		leadd.push([l.name, l.value]);
	}
	io.emit("leaderboard", leadd)
}
function calcStats(player) {
	oldv = int(player.value);
	player.speed = 10;
	player.mhealth = 100;
	player.attackspeed = 10;
	player.damage = 10;
	player.armorp = 0;
	player.armor = 0;
	player.regen = 10;
	player.value = 0;
	for (mine of[player.helmet, player.chest, player.boots, player.weapon]) {
		if (mine) {
			player.speed += (mine.speed != undefined ? mine.speed : 0)
			player.damage += (mine.damage != undefined ? mine.damage : 0)
			player.attackspeed += (mine.aspeed != undefined ? mine.aspeed : 0)
			player.armorp += (mine.armorp != undefined ? mine.armorp : 0)
			player.armor += (mine.armor != undefined ? mine.armor : 0)
			player.mhealth += (mine.health != undefined ? mine.health : 0)
			player.regen += (mine.regen != undefined ? mine.regen : 0)
			player.value += mine.cost;
		}
	}
	player.value += player.money;
	if (player.value != oldv) {
		calcLeaderboard();
	}
}
var maplimitx = 7500;
var maplimity = 4500;
var io = require('socket.io').listen(server);
var players = [];
var obs = [];
var numobs = 100;
var ppminx = 50;
var ppminy = 150;
var pominx = 58;
var pominy = 129;
var rjoin = [];
var helmets = {
	VikingHelmet: {
		name: "Viking Helmet",
		health: 5,
		armor: 1,
		cost: 10,
		wid: 80,
		by: 75,
		image: "vikinghelmet"
	}
}
var chest = {
	KnightChestplate: {
		name: "Knight Chestplate",
		health: 10,
		armor: 3,
		cost: 20,
		wid: 50,
		image: "knightchestplate"
	},
	FarmerShirt: {
		name: "Farmer Shirt",
		health: 10,
		armor: 3,
		cost: 20,
		wid: 50,
		image: "knightchestplate"
	},
	MossCape: {
		name: "Moss Cape",
		health: 83,
		
		cost: 30,
		wid: 50,
		image: "knightchestplate"
	},
	SpyCloak: {
		name: "Spy Cloak",
		health: 31,
		armor:4,
		speed:1,
		cost: 30,
		wid: 50,
		image: "knightchestplate"
	}
}
var boots = {
	Ameriboots: {
		name: "Ameriboots",
		speed: 3,
		armor: 2,
		cost: 50,
		image: "ameriboots",
		wid: 50
	},
	WeirdBoots: {
		name: "Weird Boots",
		speed: 5,
		armor: 1,
		cost: 50,
		image: "weirdboot",
		wid: 50
	},
	KnightBoots: {
		name: "Knight Boots",
		speed: 1,
		armor: 1,
		cost: 10,
		image: "knightboot",
		wid: 50
	}
}
var weapons = {
	KnightSword: {
		name: "Knight Sword",
		damage: 2,
		armorp: 1,
		aspeed: 2,
		cost: 20,
		image: "knightsword",
		len: 80
	},
	SmallBranch: {
		name: "Small Branch",
		damage: 1,
		cost: 3,
		
		image: "deadbranch",
		len: 60
	},
	Pitchfork: {
		name: "Pitchfork",
		damage: 3,
		
		cost: 10,
		image: "pitchfork",
		len: 70
	},
	Battleaxe: {
		name: "Battleaxe",
		damage: 8,
		armorp: 1,
		cost: 40,
		image: "basicsword",
		len: 150
	},
	Spear: {
		name: "Spear",
		damage: 4,
		armorp: 2,
		aspeed:3,
		cost: 40,
		image: "spear",
		len: 150
	},
	WoodenClub: {
		name: "Wooden Club",
		damage: 5,
		armorp: 2,
		aspeed: -3,
		cost: 20,
		image: "woodenclub",
		len: 85,
		st: "10% chance of stunning opponent for 1 second."
	},
	Candlestick: {
		name: "Candlestick",
		damage: 4,
		
		aspeed: 5,
		cost: 63,
		image: "basicsword",
		len: 80,
		st: "50% chance to light on fire when attacking."
	},
};
onHit = {
	WoodenClub: function (player, op) {
		if (Math.random() <= 0.1) {
			addEffect(op, 0, 200);
		}
	}
}
for (var i = 0; i < (numobs * 0.4); i++) {
	nx = Math.floor((Math.random() * maplimitx));
	ny = Math.floor((Math.random() * maplimity));
	nob = {
		pos: [nx, ny]
	};
	nob.money = 1;
	nob.health = 50;
	nob.type = 1;
	nob.rect = {
		top: nob.pos[1] - 33,
		bottom: nob.pos[1] + 33,
		left: nob.pos[0] - 33,
		right: nob.pos[0] + 33,
	};
	nob.id = Math.random();
	obs.push(nob);
}
for (var i = 0; i < (numobs * 0.3); i++) {
	nx = Math.floor((Math.random() * maplimitx));
	ny = Math.floor((Math.random() * maplimity));
	nob = {
		pos: [nx, ny]
	};
	nob.money = 3;
	nob.health = 150;
	nob.type = 2;
	nob.id = Math.random();
	nob.rect = {
		top: nob.pos[1] - 33,
		bottom: nob.pos[1] + 33,
		left: nob.pos[0] - 33,
		right: nob.pos[0] + 33,
	};
	obs.push(nob);
}
for (var i = 0; i < (numobs * 0.2); i++) {
	nx = Math.floor((Math.random() * maplimitx));
	ny = Math.floor((Math.random() * maplimity));
	nob = {
		pos: [nx, ny]
	};
	nob.money = 9;
	nob.health = 450;
	nob.type = 3;
	nob.id = Math.random();
	nob.rect = {
		top: nob.pos[1] - 33,
		bottom: nob.pos[1] + 33,
		left: nob.pos[0] - 33,
		right: nob.pos[0] + 33,
	};
	obs.push(nob);
}
for (var i = 0; i < (numobs * 0.1); i++) {
	nx = Math.floor((Math.random() * maplimitx));
	ny = Math.floor((Math.random() * maplimity));
	nob = {
		pos: [nx, ny]
	};
	nob.money = 27;
	nob.health = 1350;
	nob.type = 4;
	nob.id = Math.random();
	nob.rect = {
		top: nob.pos[1] - 33,
		bottom: nob.pos[1] + 33,
		left: nob.pos[0] - 33,
		right: nob.pos[0] + 33,
	};
	obs.push(nob);
}
setInterval(redirectToUpdate, 5);
urt = function () {
	len = rjoin.length
		for (var i = 0; i < len; i++) {
			r[2] += 1;
			if (r[2] > 120) {
				index = rjoin.indexOf(r);
				rjoin.splice(index, 1);
				len -= 1;
			}
		}
}
addEffect = function (player, eid, duration) {
	player.effects.push([eid, duration, duration]);
	io.emit("effect", [player.id, eid, duration, duration]);
}
setInterval(urt, 10000)
io.sockets.on('connection', function (socket, username) {
	socket.emit("items", [helmets, chest, boots, weapons]);
	socket.on('newplayer', function (info) {
		socket.name = info[0];
		socket.pos = [Math.floor((Math.random() * maplimitx)), Math.floor((Math.random() * maplimity))];
		socket.direction = 0
			socket.actspeed = 1;
		socket.chealth = 100;
		socket.attacking = !1;
		socket.anim = 0;
		socket.attackdel = 0;
		socket.attackspeed = 10;
		socket.value = 0;
		socket.ld = "none";
		socket.id = Math.random();
		socket.rect = {
			right: 0,
			left: 0,
			top: 0,
			bottom: 0
		};
		socket.facing = "right";
		socket.money = 990;
		socket.hasHit = [];
		socket.rdelay = 0;
		socket.weapon = false;
		socket.chest = false;
		socket.helmet = false;
		socket.boots = false;
		socket.dt = [];
		socket.rt = 0;
		socket.regen = 10;
		socket.effects = [];
		players[players.length] = socket;
		if (info[1]) {
			for (r of rjoin) {
				if (r[0] == info[1]) {
					socket.money = r[1];
					index = players.indexOf(r);
					rjoin.splice(index, 1);
				}
			}
		}
		console.log(info[0] + " has joined, with " + socket.money + " money");
		calcStats(socket);
		socket.emit("allshapes", obs);
		every = [];
		for (player of players) {
			every.push({
				id: player.id,
				effects: player.effects,
				dt: player.dt,
				facing: player.facing,
				name: player.name,
				pos: player.pos,
				mhealth: player.mhealth,
				chealth: player.chealth,
				anim: player.anim,
				helmet: player.helmet.name,
				chest: player.chest.name,
				boots: player.boots.name,
				weapon: player.weapon.name
			});
		}
		io.emit("allplayers", every);
		calcLeaderboard();
	});
	socket.on('dchange', function (newd) {
		socket.direction = newd[0];
		d = -newd[0]
			upt = d < 90 && d > 0
			dnt = d > 270 && d < 360
			if (upt || dnt) {
				socket.facing = "right"
			} else if (d !== 0) {
				socket.facing = "left"
			}
			socket.actspeed = Math.min(newd[1], 1);
	});
	socket.on('buyitem', function (iname) {
		iname = iname.replace(/\s+/g, '');
		if (helmets.hasOwnProperty(iname)) {
			z = 'helmet';
			item = helmets[iname];
		} else if (chest.hasOwnProperty(iname)) {
			z = 'chest';
			item = chest[iname];
		} else if (boots.hasOwnProperty(iname)) {
			z = 'boots';
			item = boots[iname];
		} else if (weapons.hasOwnProperty(iname)) {
			z = 'weapons';
			item = weapons[iname];
		}
		if (item == undefined) {
			item = {
				cost: 9999999
			}
		};
		if (socket.money >= item.cost) {
			socket.money -= item.cost;
			if (z == "helmet") {
				socket.helmet = item;
			} else if (z == "chest") {
				socket.chest = item;
			} else if (z == "boots") {
				socket.boots = item;
			} else if (z == "weapons") {
				socket.weapon = item;
			}
			socket.chealth += (item.health != undefined ? item.health : 0)
			console.log(socket.name + " bought: " + item.name);
			calcStats(socket);
			if (player.chealth > player.mhealth) {
				player.chealth = player.mhealth;
			}
			io.emit("echange", [socket.id, socket.helmet.name, socket.chest.name, socket.boots.name, socket.weapon.name, socket.chealth, socket.mhealth]);
		}
	});
	socket.on('astart', function (info) {
		socket.attacking = !0;
	});
	socket.on('aend', function (info) {
		socket.attacking = !1
	});
	socket.on('quit', function (rj) {
		console.log(socket.name + " quit.");
		if (players.includes(socket)) {
			index = players.indexOf(socket);
			players.splice(index, 1);
		}
		socket.disconnect(0);
		every = [];
		for (player of players) {
			every.push({
				id: player.id,
				effects: player.effects,
				dt: player.dt,
				facing: player.facing,
				name: player.name,
				pos: player.pos,
				mhealth: player.mhealth,
				chealth: player.chealth,
				anim: player.anim,
				helmet: player.helmet.name,
				chest: player.chest.name,
				boots: player.boots.name,
				weapon: player.weapon.name
			});
		}
		io.emit("allplayers", every);
		ff(rj);
		calcLeaderboard();
	});
});
server.listen(8080);
