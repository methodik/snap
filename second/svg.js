var bgColor = '#ea7373';
var forColor = '#fff';

// create and append the elements
var p = Snap('#progress');

function circLg(cx, cy) {
  return p.circle(64, 64, 32).attr({
    cx : cx,
    cy : cy,
    fill : bgColor,
    'stroke-width' : 3,
    stroke : forColor
  });  
}

function circSm(cx, cy) {
  return p.circle(4, 4, 2).attr({
    cx : cx,
    cy : cy,
    fill : '#fff',
    stroke : forColor,
    class : 'small'
  });
}

function createText(x, y, number) {
  return p.text(x, y, number).attr({
    fill : '#fff',
    'font-family' : 'lobster',
    'font-size' : '20px'
  });
}



// make groups
var groups = [];
var dist = 98;

// Generate Circles
for ( var i = 0; i < 4; i++ ) {
  var offset = dist;

  if ( groups.length > 0 ) {
    offset = parseInt(groups[i - 1].select('circle').attr('cx')) + dist;
  } else {
    offset = 34;
  }
  groups.push(p.g(circLg(offset, 48), createText(offset - 4, 54, i + 1)));
}

p.select('g').attr('class', 'active');

groups.paper = p;

groups.next = function () {
  var active = this.getActive();
  var nextGroup = this.getNext();
  
  this.jump();
  
  active.el.attr('class', '');
  nextGroup.el.attr('class', 'active');
}

groups.jump = function() {
  var gCur = p.select('.active'); // better way to do this using the array.
  var circX = parseInt(gCur.select('circle').attr('cx'));
  
  p.add(circSm(circX + 43, 48));
  p.add(circSm(circX + 56, 48));
  
  var smallCircles = p.selectAll('.small');
  smallCircles[1].attr({ opacity : '.5' });

  smallCircles[0].animate({ opacity : 0 }, 300);
  smallCircles[1].animate({ opacity: 1 }, 300, function() {
    smallCircles.forEach(function(circle) {
      circle.remove();
    });
  });

  console.log(this.paper);
}

groups.getNext = function () {
  var active = this.getActive();
  var nextPos = active.pos + 1;

  if (nextPos >= this.length) {
    nextPos = 0;
  }

  return {
    pos: nextPos,
    el: this[nextPos]
  }
}

groups.getActive = function () {
  var rtn = {
    pos: 0,
    el: null
  };

  this.forEach(function (group, i) {
    if (group.attr('class') && group.attr('class').search("active") !== -1) {
      rtn.el = group;
      rtn.pos = i;
    }
  });

  return rtn;
}

groups.zoom = function() {
  this.select('circle').animate({r: 36}, 200, mina.bounce);
  return false;
}

groups.unzoom = function() {
  this.select('circle').animate({r: 32}, 200, mina.bounce);
  return false;
}

for ( var i = 0; i < groups.length; i ++ ) {
  groups[i].hover(groups.zoom, groups.unzoom);
}


// button
var jumpButton = document.getElementById('animOne');

jumpButton.onclick = function() {
  groups.next();
}
