const ELEMENT_IMG_URL = 'https://assets.andromia.science/elements';
const urlParams = {};
(window.onpopstate = function () {
  let match;
  const pl = /\+/g; // Regex for replacing addition symbol with a space
  const search = /([^&=]+)=?([^&]*)/g;
  const decode = function (s) {
    return decodeURIComponent(s.replace(pl, ' '));
  };
  const query = window.location.search.substring(1);

  while ((match = search.exec(query))) urlParams[decode(match[1])] = decode(match[2]);
})();

$(document).ready(() => {
  RemplirAtlas();

  $('#btnAddPortal').click(() => {
    addPortal();
  })

  $('#btnMiner').click(() => {
    minePlanet(urlParams.planet);
  });
});

async function retrievePlanet(href) {
  try {
    const response = await axios.get(href);
    if (response.status === 200) {
      const planet = response.data;
      $('#lblName').html(planet.name);
      $('#lblDiscoveredBy').html(planet.discoveredBy);
      $('#lblDiscoveryDate').html(planet.discoveryDate);
      $('#lblTemperature').html(planet.temperature);
      $('#lblPosition').html(`(${planet.position.x.toFixed(3)} ; ${planet.position.y.toFixed(3)} ; ${planet.position.z.toFixed(3)})`);

      $('#imgIcon').attr('src', planet.icon);

      //Afficher les satellites

      if (planet.satellites.length > 0) {
        planet.satellites.forEach(s => {
          $('#satellites').append(`<li>${s}</li>`);
        })
      } else {
        $('#satellites').append('Aucun satellite');
      }

      //Afficher les portals
      displayPortals(planet.portals);


    }
  } catch (err) {
    console.log(err);
  }
}



function displayPortals(portals) {

  portals.forEach(p => {

    //Créer le html (tr)
    const infoPortal = displayPortal(p);

    //Injecter le html
    $('#portals tbody').append(infoPortal);

  });

}

function displayPortal(portal) {
  let infoPortal = '<tr>';
  infoPortal += `<td>${portal.position}</td>`;
  infoPortal += `<td><img class="affinity" src="img/${portal.affinity}.svg" /></td>`;
  infoPortal += '</tr>';
  return infoPortal;
}


async function addPortal() {
  const body = {
    position: $('#txtPortalPosition').val(),
    affinity: $('#cboAffinity').val()
  };

  const URL = `${urlParams.planet}/portals`;

  try {
    const response = await axios.post(URL, body);
    if (response.status === 201) {
      const infoPortal = displayPortal(response.data);

      $('#portals tbody').prepend(infoPortal);

    }
  } catch (err) {
    console.log(err);
  }

}
