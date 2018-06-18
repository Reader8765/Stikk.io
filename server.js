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
Array.prototype.remove = function (element) {
	var index = this.indexOf(element);

	if (!~index) {
		console.trace("Element not in array!");

		throw "Element not in array!";

	}
	this.splice(index, 1);
}
var present = require('present');
var fps=200;
var interval=1000/fps;
var pVal=Math.min(10/fps,1);
var adjInterval=interval+0;
var badFrames=0;
var wasSlow=false;
function redirectToUpdate(){
	
	
	var thisTime=present();

	var diff=thisTime-lastTime;
	lastTime=thisTime;
	update();
	
	var wentOver=interval-diff;
	
	//console.log("Took:"+diff);
	//console.log("Error:"+wentOver);
	var idealInterval=adjInterval+(wentOver*pVal);
	adjInterval=Math.max(0,idealInterval);
	if(idealInterval>=0){
		badFrames=0;
		if(wasSlow){
			console.log("Server no longer slowed. There are " +players.length+" players. It took "+diff+" to update. It should take "+interval+".");
			wasSlow=false;
		}
	}else{
		badFrames+=1;
		if(badFrames>=1000 && !wasSlow){
			wasSlow=true;
			console.log("Server Slowdown! There are " +players.length+" players. It took "+diff+" to update. It should take "+interval+".")
		}
	}
	//console.log("Interval:"+adjInterval)
	
	setTimeout(redirectToUpdate,adjInterval);
}
// redirectToUpdate starts at end of file

function regenPlayer(player, amnt) {
	if (player.chealth < player.mhealth) {
		player.chealth += amnt;
		if (player.chealth > player.mhealth) {
			player.chealth = player.mhealth + 0;
		}
		io.emit("healthchange", [player.id, player.chealth])
	}
}
function randomChance(chance) {
	return Math.random() < chance;
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
function debug(info) {
	addEffect("map", "debug", 5, 1, info)
}
function isOutOfBounds(x, y) {
	return x > maplimitx || y > maplimity || x < 0 || y < 0;
}
function isSwordSwinging(player) {
	return (!(!player.attacking && player.attackdel == 0))
}
function update() {
	//*Uber-lag:*/ for (player of players) {for (player of players) {for (player of players) {for (player of players) {for (player of players) {for (player of players) {}}}}}}
	for (ob of obs) {
		var donef=[];
		for (f of ob.effects) {
			if (f[0] == 1) {
				if (f[3][0] >= f[3][1]) {

					damageShape(ob, f[3][3], f[3][2], false)
					f[3][0] = 0;

				} else {
					f[3][0] += 1;
				}
			}
			f[1] -= 1
			if (f[1] < 1) {
				donef.push(f);
			}
		}
		for (f of donef) {
			ob.effects.remove(f);
		}

	}
	var pi = []
	var rem = [];
	projLoop:
	for (proj of projs) {
		proj.pos[0] += proj.vel[0];
		proj.pos[1] += proj.vel[1];
		proj.traveled += proj.speed;
		pi.push([proj.id, proj.pos])
		player = proj.shotby
		proj.hitpos = [proj.pos[0] + proj.hitoff[0], proj.pos[1] + proj.hitoff[1]]
		if (isOutOfBounds(proj.hitpos[0], proj.hitpos[1])) {
			rem.push(proj)
			continue projLoop;
		}
		if (proj.traveled > proj.range) {
			rem.push(proj)
			continue projLoop;
		}
		for (ob of obs) {
			inter = intersectPoint(proj.hitpos, ob.rect);
			if (inter) {
				damageShape(ob, player, proj.damage, true)
				rem.push(proj)
				continue projLoop;

			}
		}
		for (op of players) {
			inter = intersectPoint(proj.hitpos, op.rect);
			if (inter) {
				doDamage(player, op, true, proj.damage)
				rem.push(proj)
				continue projLoop;
			}
		}

	}
	for (r of rem) {
		remProj(r);
	}
	var spi = [];
	var deadPlayers = [];
	for (player of players) {
		var slow=Math.pow(player.pos[0],9999)
		if (player.atype == "Melee") {
			player.anim = Math.round(player.attackdel / 10);
		} else if (player.atype == "Ranged") {

			if (player.direction > -90) {

				aangle = 50 - Math.abs(int(player.direction))
				aangle = Math.min(Math.max(aangle, 0), 100)
			} else if (player.direction < -270) {

				aangle = 51 - (Math.abs((int(player.direction))) - 360)
				aangle = Math.min(Math.max(aangle, 0), 100)
			} else { // if (player.direction<-131 && player.direction>-232)

				aangle = (Math.abs((int(player.direction))) - 108) - 24
				aangle = Math.min(Math.max(aangle, 0), 100)
			}
			player.anim = aangle
			aangle = aangle + 40
			if (player.facing == "left") {
				aangle = 360 - aangle
			}

		}
		var speedMod;
		if (isSwordSwinging(player)) {
			speedMod = 0.5;
		} else {
			speedMod = 1;
		};

		var boostMod = 1;
		if (player.boosting) {
			if (player.availBoost > 0) {
				boostMod += (player.boostSpeed / 10);
				player.availBoost -= 2;
				player.emit("boostchange", player.availBoost);
			}
		}
		else {
			if (player.availBoost < player.maxBoost) {
				player.availBoost += 0.00025 * player.maxBoost;
				player.emit("boostchange", player.availBoost);
			}
		}
//to glicth collitsions, they mighjt? need to be both moving updawrd
		var xm = (player.speed / 10) * player.actspeed * Math.cos(player.direction * Math.PI / 180) * speedMod * boostMod;
		var ym = (player.speed / 10) * player.actspeed * Math.sin(player.direction * Math.PI / 180) * speedMod * boostMod;
		var donef = [];
		var stunned = false;
		for (f of player.effects) {
			if (f[0] == 0) {
				player.attackdel = 0;
				xm = 0;
				stunned = true;
				ym = 0;
			}
			if (f[0] == 1) {
				if (f[3][0] >= f[3][1]) {

					f[3][0] = 0;

					dirDamage(player, f[3][2], f[3][3])
				} else {
					f[3][0] += 1;
				}

			}
			f[1] -= 1
			if (f[1] < 1) {
				donef.push(f);
			}
		}
		for (f of donef) {
			player.effects.remove(f);

		}
		if (player.atype == "Melee") {
			if (isSwordSwinging(player)) {
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
							doDamage(player, op, true, player.damage);
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
							damageShape(ob, player, player.damage, true)
						}
					}
				}

				if (player.attackdel >= 1000) {
					player.attackdel = 0;
					player.hasHit = [];
				}
			}
		} else if (player.atype == "Ranged") {

			if (player.attacking) {
				if (player.attackdel == 0 && !stunned) {
					pos = rotate_point(player.pos[0], -40 + player.pos[1], player.pos[0], player.pos[1], aangle);
					pos = [pos.x, pos.y]
					addProj(player.weapon, pos, aangle, player)
				}
			}
			if (!(!player.attacking && player.attackdel == 0)) {
				player.attackdel += player.attackspeed;
				if (player.attackdel >= 1000) {
					player.attackdel = 0;
				}
			}

		}
		player.pos[0] += xm;
		for (op of players) {
			if (op != player) {

				var dx = player.pos[0] - op.pos[0];
				var dy = player.pos[1] - op.pos[1];
				if (Math.abs(dx) < ppminx && Math.abs(dy) < ppminy) {
					if (dx  < 0) {
						player.pos[0] += (Math.abs(dx) - ppminx);
					} else {
						player.pos[0] -= (Math.abs(dx) - ppminx);
					}
				}
			}
		}
		for (ob of obs) {
			var dx = player.pos[0] - ob.pos[0];
			var dy = player.pos[1] - ob.pos[1];
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
				var dx = player.pos[0] - op.pos[0];
				var dy = player.pos[1] - op.pos[1];
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
			var dx = player.pos[0] - ob.pos[0];
			var dy = player.pos[1] - ob.pos[1];
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
		spi.push([player.id, [Math.round(player.pos[0]), Math.round(player.pos[1])], player.facing, player.anim, boostMod > 1]);

		if (player.chealth <= 0) {
			kill(player, op);
			deadPlayers.push(player);
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
	io.emit("update", [spi, pi]);
	for (dead of deadPlayers) {
		players.remove(dead);

	}


}
function rotate_point(pointX, pointY, originX, originY, angle) {
	angle = angle * Math.PI / 180.0;
	return {
		x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
		y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
	};
}

function roundList(list) {
	for (var i = 0; i < list.length; i++) {
		list[i] = Math.round(list[i])
	}
}
function addProj(weapon, pos, ang, shotby) {
	n = {
		id: Math.random(),
		type: weapon.name,
		pos: pos,
		ang: ang
	}
	io.emit("newproj", n);
	n.shotby = shotby;
	n.vel = [weapon.projSpeed * Math.sin(ang * Math.PI / 180), -weapon.projSpeed * Math.cos(ang * Math.PI / 180)]
	len = weapon.ammolen / 2;
	n.range = weapon.range;
	n.hitoff = [len * Math.sin(ang * Math.PI / 180), -len * Math.cos(ang * Math.PI / 180)]
	n.damage = shotby.damage;
	n.traveled = 0;
	n.speed = weapon.projSpeed;
	projs.push(n);
}
function remProj(proj) {
	projs.remove(proj);

	io.emit("delproj", proj.id)
}

function doDamage(player, op, abil, d) {
	player.hasHit.push(op);
	op.ld = player.id;
	d = Math.max(d - (Math.max(op.armor - player.armorp, 0)), 0);

	for (mine of [player.helmet, player.chest, player.boots, player.weapon]) {
		if (mine) {
			un = mine.name.replace(/\s+/g, '')
			if (onHit.hasOwnProperty(un)) {

				onHit[un](player, op);
			}
		}
	}
	for (mine of [op.helmet, op.chest, op.boots, op.weapon]) {
		if (mine) {
			un = mine.name.replace(/\s+/g, '')
			if (onAttacked.hasOwnProperty(un)) {
				d = onAttacked[un](player, op, d);
			}
		}

	}
	op.chealth -= d;
	op.rt = 2000;
	io.emit("healthchange", [op.id, op.chealth])
}
function dirDamage(player, da, id) {

	player.chealth -= da;
	player.rt = 2000;
	player.ld = id;
	io.emit("healthchange", [player.id, player.chealth])
}
function ff(rid) {
	if (rid) {
		for (r of rjoin) {
			if (r[0] == rid) {
				rjoin.remove(r);

				break;
			}
		}
	}
}
function damageShape(shape, player, da, abil) {
	shape.health -= da;
	if (abil) {
		for (mine of [player.helmet, player.chest, player.boots, player.weapon]) {
			if (mine) {
				un = mine.name.replace(/\s+/g, '')
				if (onShapeHit.hasOwnProperty(un)) {

					onShapeHit[un](player, shape);
				}
			}
		}
	}
	if (shape.health <= 0) {

		spawnShape(shape, player)

	} else {
		io.emit("shapechange", {
			shape: shape.id,
			newp: shape.health
		});
	}
}
function spawnShape(old, player) {
	if (!(obs.includes(old))) {
		return;
	}
	oldt = old.type;

	if (oldt == 1) {
		nx = Math.floor((Math.random() * maplimitx));
		ny = Math.floor((Math.random() * maplimity));
		nob = {
			pos: [nx, ny]
		};
		nob.money = 1;
		nob.effects = [];
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
		nob.effects = [];
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
		nob.effects = [];
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
		nob.effects = [];
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

	if (typeof player === 'number') {
		for (p of players) {
			if (p.id == player) {
				player = p;
			}
		}

	}
	if (typeof player !== 'number') {//will happen if the player quit
		changeMoney(player, old.money)}

	obs.remove(old);

	io.emit("newshape", {
		news: nob,
		rem: old.id
	})
}
function kill(dead) {
	calcStats(dead);
    var killer=false;
	for (var player of players) {
		if (player.id == dead.ld) {
			var killer = player;
		}
	}
	
	if(killer){
		changeMoney(killer, int(dead.value / 2))
	}
	killer={name:"Player"};

	rdid = Math.random();
	r = [rdid, int(dead.value / 2), 0];
	rjoin.push(r);
	console.log(dead.name + " has been killed by " + killer.name + ". They had " + dead.value + " value, so they will start with " + r[1] + " money.");
	dead.emit("dead", [killer.name, [r[0], r[1]]]);

	calcLeaderboard();
	io.emit("delplayer", dead.id);
}
function calcLeaderboard() {
	var topNum = 3;
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
	io.emit("leaderboard", leadd);
}
Math.dist = function (pos1, pos2) {
	x1 = pos1[0]
	x2 = pos2[0]
	y1 = pos1[1]
	y2 = pos2[1]

	var xs = x2 - x1,
		ys = y2 - y1;

	xs *= xs;
	ys *= ys;

	return Math.sqrt(xs + ys);
};
function changeMoney(player, changeBy) {
	player.money += changeBy
	player.emit("moneyChange", player.money)
	calcStats(player)
}
function calcStats(player) {
	oldv = int(player.value);
	oldMon = int(player.money);
	player.speed = 10;
	player.mhealth = 100;
	player.attackspeed = 10;
	player.boostSpeed = 5;
	player.damage = 10;
	player.armorp = 0;
	player.armor = 0;
	player.regen = 10;
	player.maxBoost = calcBoost(player);
	player.value = 0;
	player.atype = "Melee";
	for (mine of [player.helmet, player.chest, player.boots, player.weapon]) {
		if (mine) {
			player.speed += (mine.speed != undefined ? mine.speed : 0)
			player.damage += (mine.damage != undefined ? mine.damage : 0)
			player.attackspeed += (mine.aspeed != undefined ? mine.aspeed : 0)
			player.armorp += (mine.armorp != undefined ? mine.armorp : 0)
			player.armor += (mine.armor != undefined ? mine.armor : 0)
			player.mhealth += (mine.health != undefined ? mine.health : 0)
			player.regen += (mine.regen != undefined ? mine.regen : 0)
			player.boostSpeed += (mine.boostSpeed != undefined ? mine.boostSpeed : 0)
			player.maxBoost += (mine.boosttime != undefined ? mine.boosttime * 10 : 0)
			player.atype = (mine.type != undefined ? mine.type : "Melee")
		}
	}
	player.value += player.totalItemCosts;


	player.value += player.money;
	if (player.value != oldv) {
		calcLeaderboard();
	};

	if (player.availBoost > player.maxBoost) {
		player.availBoost = player.maxBoost;
	}


}
function calcBoost(player) {
	var b = 1000;//1000
	b -= player.maxCost["chest"];
	b -= player.maxCost["helmet"];
	b -= player.maxCost["boots"];
	b -= player.maxCost["weapon"];
	return b;
}
var maplimitx = 7500;
var maplimity = 4500;
var io = require('socket.io').listen(server);
var players = [];
var obs = [];
var projs = [];
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

	//T2
	LeatherShirt: {
		name: "Leather Shirt",
		health: 10,
		armor: 3,
		cost: 20,
		wid: 40,
		by: 0,
		image: "leathershirt"
	},
	//T3
	MossCape: {
		name: "Moss Cape",
		health: 73,
		regen: 1,
		cost: 30,
		wid: 50,
		by: 15,
		image: "mosscape",
		imageback: "mosscapeback"
	},
	//T4
	SpyCloak: {
		name: "Spy Cloak",
		health: 31,
		armor: 4,
		boostSpeed: 1,
		cost: 50,
		wid: 50,
		by: 0,
		image: "spycloak"
	},
	SkeletonSuit: {
		name: "Skeleton Suit",
		health: 96,
		armor: 2,

		regen: 4,
		cost: 50,
		wid: 50,
		by: 0,
		image: "skeletonsuit"
	},
	//T5
	ElvenCloak: {
		name: "Elven Cloak",
		health: 65,
		armor: 3,
		boosttime: 7,
		regen: 2,
		cost: 70,
		wid: 50,
		by: 0,
		image: "elvencloak"
	},
	ChainmailChestplate: {
		name: "Chainmail Chestplate",
		health: 10,
		armor: 10,
		cost: 70,
		wid: 50,
		by: 0,
		image: "chainmailchestplate",
		st: "10% chance of taking 0 damage."
	},

	//T6
	KnightChestplate: {
		name: "Knight Chestplate",
		health: 15,
		armor: 15,
		cost: 100,
		wid: 50,
		by: 0,
		image: "knightchestplate"
	},
	ArcherCloak: {
		name: "Archer Cloak",
		health: 178,
		armor: 3,
		cost: 100,
		wid: 50,
		boostSpeed: 1,
		image: "archercloak",
		by: 0,
		st: "Your ranged weapons do 20% more damage."
	},
	//T7
	ArmyJacket: {
		name: "Army Jacket",
		health: 200,
		armor: 8,
		cost: 120,
		wid: 50,
		by: 0,
		image: "armyjacket"
	},
	BlazingCloak: {
		name: "Blazing Cloak",
		health: 149,
		armor: 8,
		cost: 120,
		wid: 50,
		by: 0,
		image: "blazingcloak",
		st: "When you are hit by a melee weapon, there is a 25% chance attacker is lit on fire."
	},
	//T9
	TeslaChestplate: {
		name: "Tesla Chestplate",
		health: 339,
		armor: 9,
		cost: 200,
		wid: 50,
		by: 0,
		image: "teslachestplate",
		st: "When you are attacked, 10% chance to zap 3 nearby shapes or players for 20 damage."
	},
	GoldenCloak: {
		name: "Golden Cloak",
		health: 447,
		armor: 6,
		cost: 220,
		wid: 50,
		by: 0,
		image: "goldencloak",
		st: "Your stun abilities have 10% greater chance to activate."
	},
	//T10
	ChestplateOfGlory: {
		name: "Chestplate Of Glory",
		health: 329,
		armor: 21,
		cost: 300,
		wid: 50,
		by: 0,
		image: "chestplateofglory",

	},

}
var weapons = {
	//T0
	SmallBranch: {
		name: "Small Branch",
		damage: 1,
		type: "Melee",
		cost: 3,

		image: "deadbranch",
		len: 60
	},
	//T1
	Pitchfork: {
		name: "Pitchfork",
		damage: 3,

		type: "Melee",
		cost: 10,
		image: "pitchfork",
		len: 70
	},
	BasicBow: {
		name: "Basic Bow",
		damage: 1,
		aspeed: -3,
		type: "Ranged",
		cost: 10,
		range: 750,
		projSpeed: 5,
		image: "bow",
		ammolen: 70,
		len: 80,
		offx: -20,
		dispDist: 0,
	},
	Candlestick: {
		name: "Candlestick",
		aspeed: 2,
		type: "Melee",
		cost: 15,
		image: "candlestick",
		len: 60,
		st: "25% chance to light opponent on fire when attacking."
	},
	//T2
	KnightSword: {
		name: "Knight Sword",
		damage: 2,
		armorp: 1,
		aspeed: 2,
		type: "Melee",
		cost: 20,
		image: "knightsword",
		len: 80
	},
	WoodenClub: {
		name: "Wooden Club",
		damage: 5,
		armorp: 3,
		aspeed: -3,
		type: "Melee",
		cost: 20,
		image: "woodenclub",
		len: 85,
		st: "10% chance of stunning opponent for 1 second."
	},
	//T3
	Battleaxe: {
		name: "Battleaxe",
		damage: 8,
		armorp: 1,
		type: "Melee",
		cost: 40,
		image: "battleaxe",
		len: 120
	},
	Spear: {
		name: "Spear",
		damage: 4,
		armorp: 2,
		aspeed: 3,
		type: "Melee",
		cost: 40,
		image: "spear",
		len: 150
	},
	//T4
	Torch: {
		name: "Torch",
		aspeed: 2,
		damage: 4,
		type: "Melee",
		cost: 65,
		image: "torch",
		len: 110,
		st: "25% chance to light opponent on fire when attacking."
	},
	/*FlamingBow: {
	name: "Flaming Bow",//stats wrong!!
	damage: 1,
	type: "Ranged",
	cost: 10,
	range: 750,
	projSpeed: 5,
	image: "bow",
	ammolen: 70,
	len: 80,
	offx: -20
	},*/
	//T5
	Mace: {
		name: "Mace",
		aspeed: -1,
		damage: 11,
		armorp: 5,
		type: "Melee",
		cost: 80,
		image: "mace",
		len: 100,
		st: "10% chance of stunning opponent for 1 second."

	},
	//T6

	ElvenBlade: {
		name: "Elven Blade",
		aspeed: 9,
		damage: 9,
		armorp: 2,
		type: "Melee",
		cost: 100,
		image: "elvenblade",
		len: 120
	},
	TeslaSword: {
		name: "Tesla Sword",
		aspeed: 1,
		damage: 9,
		armorp: 5,
		type: "Melee",
		cost: 100,
		image: "teslasword",
		len: 100,
		st: "When attacking, 20% chance to zap 3 nearby shapes or players for 20 damage."
	},
	//T8
	MegaHammer: {
		name: "Mega Hammer",
		aspeed: -5,
		damage: 76,
		armorp: 10,
		type: "Melee",
		cost: 150,
		image: "megahammer",
		len: 120

	},
	SpyKnife: {
		name: "Spy Knife",
		aspeed: 10,
		damage: 19,
		type: "Melee",
		cost: 150,
		image: "spyknife",
		len: 50

	},
	//T9
	BlazingSword: {
		name: "Blazing Sword",
		aspeed: 3,
		damage: 32,
		armorp: 3,
		type: "Melee",
		cost: 200,
		image: "blazingsword",
		len: 90,
		st: "25% chance to light opponent on fire when attacking."

	},
	Trident: {
		name: "Trident",
		aspeed: 1,
		damage: 41,
		armorp: 3,
		type: "Melee",
		cost: 200,
		image: "trident",
		len: 150
	},
	//T10
	Flamethrower: {
		name: "Flamethrower",
		damage: 5,
		aspeed: 53,//21
		armorp: 10,
		type: "Ranged",
		cost: 300,
		range: 300,
		projSpeed: 5,
		image: "flamethrower",
		st: "Lights stuff on fire when attacking.",
		ammolen: 67,
		len: 50,
		dispDist: 100,
		offx: -20
	},
	VampiricSword: {
		name: "Vampiric Sword",
		aspeed: 4,
		damage: 40,
		armorp: 7,
		type: "Melee",
		cost: 300,
		st: "25% chance to heal 40 health when attacking a player.",
		image: "vampiricsword",
		len: 100
	},
	/*GoldenClub: {
	name: "Golden Club",
	aspeed: -4,
	damage: 54,
	armorp:20,
	type: "Melee",
	cost: 300,
	image: "goldenclub",
	len: 85
	}
	*/

};
var boots = {
	/*Ameriboots: {
		name: "Ameriboots",
		speed: 3,
		armor: 2,
		cost: 50,
		image: "ameriboots",
		wid: 50
	},
	/*WeirdBoots: {
		name: "Weird Boots",
		speed: 5,
		armor: 1,
		cost: 50,
		image: "weirdboot",
		wid: 50
	},*/
	//(10*boosttime+(1000-4*cost))*(5+0.boostspeed)
	KnightBoots: {
		name: "Knight Boots",
		armor: 3,
		boosttime: 8,
		cost: 60,
		image: "knightboot",
		wid: 50,
		by: 5,
	},
	VineShoes: {
		name: "Vine Shoes",
		boosttime: 1,
		boostSpeed: 1,
		regen: 1,
		cost: 12,
		image: "vineboots",
		by: 20,
		wid: 50
	},
	LeatherBoots: {
		name: "Leather Boots",
		boosttime: 3,
		cost: 10,
		image: "leatherboots",
		wid: 40,
		by: 4,
	},
	ElvenBoots: {
		name: "Elven Boots",
		boosttime: 13,
		boostSpeed: 4,
		cost: 85,
		image: "elvenboots",
		wid: 50,
		by: 4,
	},
}
function teslaEffect(player, ob) {

	md = 700;
	if (Math.random() <= 0.2) {

		czap = []
		for (p of players) {
			if (player != p) {
				dis = Math.dist(p.pos, ob.pos)

				if (dis <= md) {

					czap.push(p);
				}
			}

		}
		for (o of obs) {
			dis = Math.dist(ob.pos, o.pos)

			if (dis <= md) {
				czap.push(o);
			}

		}
		var zap = [];
		for (i = 0; i <= 3; i++) {
			if (czap.length > 0) {
				var rand = czap[Math.floor(Math.random() * czap.length)];
				czap.remove(rand);

				zap.push(rand);
			}
		}

		points = []

		for (z of zap) {
			bolt = [];
			bolt.push(ob.pos)

			mid = [(ob.pos[0] + z.pos[0]) / 2, (ob.pos[1] + z.pos[1]) / 2]
			mid = [mid[0] + ((Math.random() - 0.5) * 150), mid[1] + ((Math.random() - 0.5) * 150)]
			bolt.push(mid)

			midu = [(ob.pos[0] + mid[0]) / 2, (ob.pos[1] + mid[1]) / 2]
			midu = [midu[0] + ((Math.random() - 0.5) * 150), midu[1] + ((Math.random() - 0.5) * 150)]
			bolt.push(midu)

			midd = [(mid[0] + z.pos[0]) / 2, (mid[1] + z.pos[1]) / 2]
			midd = [midd[0] + ((Math.random() - 0.5) * 150), midd[1] + ((Math.random() - 0.5) * 150)]
			bolt.push(midd)

			bolt.push(z.pos)
			points.push(bolt)

			if (z.hasOwnProperty("name")) {
				dirDamage(z, 20, player.id)
			} else {
				damageShape(z, player, 20, false)

			}
		}

		addEffect("map", 2, 200, true, points);

	}
}
var onHit = {
	WoodenClub: function (player, op) {
		plus = (hasAbil(player, "GoldenCloak") ? 0.1 : 0);

		if (Math.random() <= 0.1 + plus) {
			addEffect(op, 0, 200, true);

		}
	},
	Mace: function (player, op) {
		plus = (hasAbil(player, "GoldenCloak") ? 0.1 : 0);
		if (Math.random() <= 0.1 + plus) {
			addEffect(op, 0, 200, true);
		}
	},
	VampiricSword: function (player, op) {
		if (randomChance(0.25)) {
			regenPlayer(player, 40);
		}

	},
	Candlestick:
		function (player, op) {
			if (Math.random() <= 0.25) {
				addEffect(op, 1, 500, false, [0, 75, 2, player.id]);
			}
		},
	Torch:
		function (player, op) {
			if (Math.random() <= 0.25) {
				addEffect(op, 1, 500, false, [0, 75, 4, player.id]);
			}
		},
	BlazingSword:
		function (player, op) {

			if (Math.random() <= 0.25) {
				addEffect(op, 1, 500, false, [0, 75, 6, player.id]);
			}
		},
	Flamethrower:
		function (player, op) {
			addEffect(op, 1, 500, false, [0, 75, 14, player.id]);
		},
	TeslaSword:
		teslaEffect
}

onShapeHit = {
	TeslaSword:
		teslaEffect,
	Candlestick:
		function (player, ob) {
			if (Math.random() <= 0.25) {
				shapeEffect(ob, 1, 500, false, [0, 75, 2, player.id]);
			}
		},
	BlazingSword:
		function (player, ob) {
			if (Math.random() <= 0.25) {
				shapeEffect(ob, 1, 500, false, [0, 75, 6, player.id]);
			}
		},
	Torch:
		function (player, ob) {
			if (Math.random() <= 0.25) {
				shapeEffect(ob, 1, 500, false, [0, 75, 4, player.id]);
			}
		},
	Flamethrower:
		function (player, ob) {

			shapeEffect(ob, 1, 500, false, [0, 75, 14, player.id]);
		},
}

onAttacked = {
	ChainmailChestplate:
		function (player, op, damage) {

			if (Math.random() <= 0.1) {

				return 0
			}
			return damage
		},
	BlazingCloak:
		function (player, op, damage) {
			if (Math.random() <= 0.25) {
				addEffect(player, 1, 500, false, [0, 75, 6]);
			}
			return damage
		},
	TeslaChestplate: function (player, op, damage) {
		teslaEffect(player, op);

		return damage;
	}

}
for (var i = 0; i < (numobs * 0.4); i++) {
	nx = Math.floor((Math.random() * maplimitx));
	ny = Math.floor((Math.random() * maplimity));
	nob = {
		pos: [nx, ny]
	};
	nob.money = 1;
	nob.effects = [];
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
	nob.effects = [];
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
	nob.effects = [];
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
	nob.effects = [];
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
function urt() {
	len = rjoin.length;
	for (var i = 0; i < len; i++) {
		r[2] += 1;
		if (r[2] > 120) {
			rjoin.remove(r);

			return;
		}
	}
}
function addEffect(player, eid, duration, stack, extra = []) {
	if (player != "map") {
		ind = "n";
		if (!stack) {
			for (e of player.effects) {
				if (e[0] == eid) {
					ind = player.effects.indexOf(e)
				}
				break
			}
		}
		if (ind == "n") {
			if (extra.length != 0) {
				player.effects.push([eid, duration, duration, extra]);
			} else {
				player.effects.push([eid, duration, duration]);
			}
			io.emit("effect", [player.id, eid, duration]);
		} else {
			if (extra.length != 0) {
				if (eid == 1) {
					extra[0] = player.effects[ind][3][0];
				}
				player.effects[ind] = [eid, duration, duration, extra];
			} else {
				player.effects.push([eid, duration, duration]);
			}
			io.emit("effect", [player.id, eid, duration]);
		}
	} else {
		io.emit("meffect", [eid, duration, extra]);
	}

}
function startBoost(player) {
	player.boosting = true;
};
function endBoost(player) {
	player.boosting = false;
};
function shapeEffect(shape, eid, duration, stack, extra = []) {
	if (shape != "map") {
		ind = "n";
		if (!stack) {
			for (e of shape.effects) {
				if (e[0] == eid) {
					ind = shape.effects.indexOf(e)
				}
				break
			}
		}
		if (ind == "n") {
			if (extra.length != 0) {
				shape.effects.push([eid, duration, duration, extra]);
			} else {
				shape.effects.push([eid, duration, duration]);
			}
			io.emit("seffect", [shape.id, eid, duration]);
		} else {
			if (extra.length != 0) {
				if (eid == 1) {
					extra[0] = shape.effects[ind][3][0];
				}
				shape.effects[ind] = [eid, duration, duration, extra];
			} else {
				shape.effects.push([eid, duration, duration]);
			}
			io.emit("seffect", [shape.id, eid, duration]);
		}
	} else {
		io.emit("meffect", [eid, duration, extra]);
	}
}
function hasAbil(player, abil) {
	for (mine of [player.helmet, player.chest, player.boots, player.weapon]) {
		if (mine) {
			un = mine.name.replace(/\s+/g, '')
			if (un == abil) {
				return true
			}
		}
	}

	return false
}
setInterval(urt, 10000)
io.sockets.on('connection', function (socket, username) {
	socket.emit("items", [helmets, chest, boots, weapons]);
	socket.on('newplayer', function (info) {
		var canJoin = true;
		if (players.indexOf(socket) != -1) {//no double-joining

			console.log(socket.name + " is a hackster!");
			canJoin = false;


		}
		if (canJoin) {
			if (info[0] == "") {
				info[0] = "Player";
			}
			socket.name = info[0];
			//var hash=require('crypto').createHash('md5').update(socket.name).digest("hex");
			//console.log(hash);
			socket.pos = [Math.floor((Math.random() * maplimitx)), Math.floor((Math.random() * maplimity))];
			socket.direction = 0;
			socket.actspeed = 1;
			socket.chealth = 100;
			socket.attacking = false;
			socket.anim = 0;
			socket.attackdel = 0;
			socket.attackspeed = 10;
			socket.value = 0;
			socket.ld = "none";

			socket.availBoost = 1000;
			socket.maxBoost = 1000;
			socket.boostSpeed = 5;
			socket.boosting = false;

			socket.id = Math.random();
			socket.rect = {
				right: 0,
				left: 0,
				top: 0,
				bottom: 0
			};
			socket.facing = "right";
			socket.money = 0;//setmoney
			socket.hasHit = [];
			socket.hasBought = [];
			socket.rdelay = 0;
			socket.weapon = false;
			socket.chest = false;
			socket.helmet = false;
			socket.boots = false;
			socket.maxCost = {
				"boots": 0,
				"weapon": 0,
				"helmet": 0,
				"chest": 0,
			}
			socket.totalItemCosts = 0;
			socket.dt = [];
			socket.rt = 0;
			socket.regen = 10;
			socket.effects = [];
			players.push(socket);
			if (info[1]) {
				for (r of rjoin) {
					if (r[0] == info[1]) {
						socket.money = r[1];
						rjoin.remove(r);

					}
				}
			}
			console.log(info[0] + " has joined, with " + socket.money + " money");
			calcStats(socket);
			socket.availBoost = socket.maxBoost;
			every = [];
			for (player of players) {
				every.push({
					id: player.id,
					effects: player.effects,

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
			cobs = [];
			for (ob of obs) {
				cobs.push({
					id: ob.id,
					effects: ob.effects,
					pos: ob.pos,
					health: ob.health,
					type: ob.type
				});
			}
			cprojs = [];
			for (p of projs) {
				cprojs.push({
					id: p.id,
					pos: p.pos,
					ang: p.direction,
					type: p.type
				});
			}
			io.emit("newplayer", [socket.id, socket.pos, socket.name])
			socket.emit("all", [every, cobs, cprojs, socket.id, socket.money, socket.maxBoost]);
			calcLeaderboard();
		}
	});
	socket.on('dchange', function (newd) {
		socket.direction = newd[0];
		d = -newd[0];
		upt = d < 90 && d >= 0
		dnt = d > 270 && d < 360
		if (upt || dnt) {
			socket.facing = "right"
		} else if (d !== 0) {
			socket.facing = "left"
		}
		socket.actspeed = Math.min(newd[1], 1);
	});
	socket.on('buyitem', function (iname) {
		if (typeof socket.name === "undefined") {
			console.log("undefined socket send.");
			console.log("connected:");
			console.log(socket.connected);
			return;
		};
		item = undefined;
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
			z = 'weapon';
			item = weapons[iname];
		}
		if (item == undefined) {
			item = {
				cost: 9999999
			}
		};
		var toPay = item.cost;
		try {
			if (socket.hasBought.includes(item.name)) {
				//already owned, no need to pay
				toPay = 0;
			}

		} catch (error) {
			console.log("The error occured!");
			console.log(error);
			console.log("hasBought=");
			console.log(socket.hasBought);
			console.log("name=");
			console.log(socket.name);
			console.log("chest=");
			console.log(socket.chest);
			console.log("helmet=");
			console.log(socket.helmet);
			console.log("weapon=");
			console.log(socket.weapon);
			console.log("boots=");
			console.log(socket.boots);
			console.log("money=");
			console.log(socket.money);
			console.log("maxCost=");
			console.log(socket.maxCost);
			console.log("item=");
			console.log(item);


		}

		if (socket.money >= toPay) {

			changeMoney(socket, -toPay);
			//if (!socket.hasBought.includes(item.name)){
			socket.hasBought.push(item.name);
			//	}

			if (z == "helmet") {
				socket.helmet = item;
			} else if (z == "chest") {
				socket.chest = item;
			} else if (z == "boots") {
				socket.boots = item;
			} else if (z == "weapon") {
				socket.weapon = item;
			}
			var healthMod = (item.health != undefined ? item.health : 0)
			var healthPerc = socket.chealth / socket.mhealth;
			socket.totalItemCosts += toPay;
			if (item.cost > socket.maxCost[z]) {
				socket.maxCost[z] = item.cost;
			};
			calcStats(socket);
			socket.chealth = int(socket.mhealth * healthPerc);
			console.log(socket.name + " bought: " + item.name);

			if (socket.chealth > socket.mhealth) {
				socket.chealth = socket.mhealth;
			}
			var curDamage = socket.mhealth - socket.chealth;
			io.emit("echange", [socket.id, item.name, z, socket.mhealth, curDamage]);
			socket.emit("maxboost", [socket.maxBoost, socket.availBoost]);

		}
	});
	socket.on('astart', function (info) {
		socket.attacking = !0;
	});
	socket.on('aend', function (info) {
		socket.attacking = !1;
	});
	socket.on('booststart', function (info) {
		startBoost(socket);
	});
	socket.on('boostend', function (info) {
		endBoost(socket);
	});
	socket.on('disconnect', function (rj) {
		console.log(socket.name + " quit.");
		if (players.includes(socket)) {
			players.remove(socket);

		}
		socket.disconnect(0);

		io.emit("delplayer", socket.id);
		ff(rj);
		calcLeaderboard();
	});
});
server.listen(8080);
lastTime=present();
redirectToUpdate();


