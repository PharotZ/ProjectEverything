let switches = document.getElementsByClassName('switch');

let style = localStorage.getItem('style');

if (style == null) {
  setTheme('light');
} else {
  setTheme(style);
}

for (let i of switches) {
  i.addEventListener('click', function () {
    let theme = this.dataset.theme;
    setTheme(theme);
  });
}

function setTheme(theme) {
  if (theme == 'light') {
    document.getElementById('switcher-id').href = './themes/light.css';
  } else if (theme == 'sky') {
    document.getElementById('switcher-id').href = './themes/sky.css';
  } else if (theme == 'purple') {
    document.getElementById('switcher-id').href = './themes/purple.css';
  } else if (theme == 'dark') {
    document.getElementById('switcher-id').href = './themes/dark.css';
  } else if (theme == 'blood') {
    document.getElementById('switcher-id').href = './themes/blood.css';
  }
  localStorage.setItem('style', theme);
}

function ChoseOption(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("brand-table");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function publishToBrandTable() {
  const logo = document.getElementById('logo').value;
  const brand = document.getElementById('brand-input').value;
  const style = document.getElementById('style').value;
  const Spec = document.getElementById('Spec').value;
  const link = document.getElementById('link').value;
  const error = document.getElementById('error');
  error.innerHTML = (!brand || !style || !Spec || !link) ? 'All values are required.' : '';
  if (brand && style) {
      const tableElement = document.getElementById('brand-table');
      const trElement = document.createElement('tr');
      const tbodyElement = document.createElement('tbody');
      const logoBra = document.createElement('td');
      const nameBra = document.createElement('td');
      const StyleBra = document.createElement('td');
      const SpecBra = document.createElement('td');
      const LinkBra = document.createElement('td');
      logoBra.innerHTML = logo;
      nameBra.innerHTML = brand;
      StyleBra.innerHTML = style;
      SpecBra.innerHTML = Spec;
      LinkBra.innerHTML = link;
      trElement.appendChild(logoBra);
      trElement.appendChild(nameBra);
      trElement.appendChild(StyleBra);
      trElement.appendChild(SpecBra);
      trElement.appendChild(LinkBra);
      tbodyElement.appendChild(trElement);
      tableElement.appendChild(tbodyElement);
  }
}

function publishToWishlistTable() {
  const price = document.getElementById('Price').value;
  const brand = document.getElementById('brand-input').value;
  const type = document.getElementById('Type').value;
  const color = document.getElementById('Color').value;
  const link = document.getElementById('link').value;
  const error = document.getElementById('error');
  error.innerHTML = (!brand || !type || !color || !link) ? 'All values are required.' : '';
  if (brand && type) {
      const tableElement = document.getElementById('wishlist-tab');
      const trElement = document.createElement('tr');
      const tbodyElement = document.createElement('tbody');
      const PriceWish = document.createElement('td');
      const nameBra = document.createElement('td');
      const TypeBra = document.createElement('td');
      const ColBra = document.createElement('td');
      const LinkBra = document.createElement('td');
      LinkBra.innerHTML = link;
      PriceWish.innerHTML = price;
      nameBra.innerHTML = brand;
      TypeBra.innerHTML = type;
      ColBra.innerHTML = color;
      trElement.appendChild(LinkBra);
      trElement.appendChild(TypeBra);
      trElement.appendChild(nameBra);
      trElement.appendChild(ColBra);
      trElement.appendChild(PriceWish);
      tbodyElement.appendChild(trElement);
      tableElement.appendChild(tbodyElement);
  }
}

