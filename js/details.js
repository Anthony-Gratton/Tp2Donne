const ELEMENT_IMG_URL = 'https://assets.andromia.science/elements';
const SERVICE_URL = `https://api.andromia.science/monsters/atlas/`;
const GENERATE_URL = "https://api.andromia.science/monsters/"
const urlParams = {};
const char = String.fromCharCode(160);
const regex = new RegExp('([A-Z]{1,2})([1-9]{1,3})'); //regex pour faire la validation de la position 1 à 2
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

  retrieveDetailsMonsters(urlParams.atlasNumber)

  $('#boutonGenerer').click(() => {
    genererMonstre(urlParams.atlasNumber);
  })

  $('#boutonLocation').click(() => {
    retrieveLocations(urlParams.atlasNumber);
  })

  $('#addLocation').click(() => {
    addLocation(urlParams.atlasNumber);
  })
});


async function addLocation(atlasNumber) {
  console.log(regex.test($('#formsPosition').val()))
  if (regex.test($('#formsPosition').val())) {

    const body = {
      position: $('#formsPosition').val(),
      time: $('#formsTime').val(),
      season: $('#formsSeason').val(),
      rates: $('#formsRates').val(),
    }
    console.log(body)

    const URL = `https://api.andromia.science/monsters/atlas/${atlasNumber}/locations`

    try {
      const response = await axios.post(URL, body);
      if (response.status === 201) {
        let l = response.data;
        let locationDt = `<tr>`
        locationDt += `<td>${l.position}</td>`
        locationDt += `<td>${l.time}</td>`
        locationDt += `<td><img class="affinity" src="images/seasons/${l.season}.png"></td>`
        locationDt += `<td><img class="affinity" src="images/rarities/${l.rates}.png"></td>`
        locationDt += `</tr>`
        $('#LocationTable tbody').prepend(locationDt);

      }
    } catch (err) {
    }

  }


}



async function retrieveLocations(atlasNumber) {
  try {
    const response = await axios.get(SERVICE_URL + atlasNumber);
    if (response.status === 200) {
      const monstersDetails = response.data;

      $('#LocationTable tbody').empty();

      monstersDetails.locations.forEach(l => {
        let locationDt = `<tr>`
        locationDt += `<td>${l.position}</td>`
        locationDt += `<td>${l.time}</td>`
        locationDt += `<td><img class="affinity" src="images/seasons/${l.season}.png"></td>`
        locationDt += `<td><img class="affinity" src="images/rarities/${l.rates}.png"></td>`
        locationDt += `</tr>`
        $('#LocationTable tbody').prepend(locationDt);
      })


    }
  } catch (err) {

  }
}




async function genererMonstre(atlasNumber) {
  try {

    const response = await axios.post(GENERATE_URL + atlasNumber + "/actions?type=generate");
    console.log(response)
    if (response.status === 201) {

      const monsterDetails = response.data;

      let monstersDts = '<tr class="textCenter">';
      monstersDts += `<td><img class="affinity" src="images/affinities/${monsterDetails.affinity}.png"></td>`;
      monstersDts += `<td>${monsterDetails.health}</td>`;
      monstersDts += `<td>${monsterDetails.damage}</td>`;
      monstersDts += `<td>${monsterDetails.speed}</td>`;
      monstersDts += `<td>${(monsterDetails.critical * 100).toFixed(2)}%</td>`;
      monstersDts += `<td><img class="affinity" src="images/affinities/${monsterDetails.talents[0]}.png"><img class="affinity" src="images/affinities/${monsterDetails.talents[1]}.png"></td>`;
      monstersDts += "<td>"
      monsterDetails.kernel.forEach(k => {
        monstersDts += `<img class="affinity" src="images/elements/${k}.png">`;
      })
      monstersDts += "</td>"

      monstersDts += '<td><div class="colored-hash" id="hash"></div>'
      monstersDts += `${monsterDetails.hash.substring(0, 2)}`

      let tabHash = [];
      let string = monsterDetails.hash.substring(2, 62);
      tabHash = string.match(/.{6}/g)

      tabHash.forEach(h => {
        monstersDts += `<span class="block" style="color:#${h}; background-color:#${h}">${char}${char}</span>`
      });

      monstersDts += `${monsterDetails.hash.substring(62)}`
      monstersDts += '</div></td></tr>';

      $('#monsterTab tbody').prepend(monstersDts);

    }
  } catch (err) {

  }
}

async function retrieveDetailsMonsters(atlasNumber) {
  try {
    const response = await axios.get(SERVICE_URL + atlasNumber);
    if (response.status === 200) {
      const monstersDetails = response.data;

      $('#atlasNumber').prepend(`<h1>${atlasNumber}</h1><img class="monsterDetails" src="${monstersDetails.assets}"><h1>${monstersDetails.name}</h1>`);

      let monsterStats = `<p class="textCenter">Health: [${monstersDetails.health.min} - ${monstersDetails.health.max}]</p><p class="textCenter">Damage: [${monstersDetails.damage.min} - ${monstersDetails.damage.max}]</p><p class="textCenter">Speed: [${monstersDetails.speed.min} - ${monstersDetails.speed.max}]</p><p class="textCenter">Critical: [${(monstersDetails.critical.min * 100).toFixed(2)} - ${(monstersDetails.critical.max * 100).toFixed(2)}]%</p>`
      $('#detail-monster').prepend(monsterStats);


      monstersDetails.specimens.forEach(s => {
        let monstersDts = '<tr class="textCenter">';
        monstersDts += `<td><img class="affinity" src="images/affinities/${s.affinity}.png"></td>`;
        monstersDts += `<td>${s.health}</td>`;
        monstersDts += `<td>${s.damage}</td>`;
        monstersDts += `<td>${s.speed}</td>`;
        monstersDts += `<td>${(s.critical * 100).toFixed(2)}%</td>`;
        monstersDts += `<td><img class="affinity" src="images/affinities/${s.talents[0]}.png"><img class="affinity" src="images/affinities/${s.talents[1]}.png"></td>`;
        monstersDts += "<td>"
        s.kernel.forEach(k => {
          monstersDts += `<img class="affinity" src="images/elements/${k}.png">`;
        })
        monstersDts += "</td>"

        monstersDts += '<td><div class="colored-hash" id="hash"></div>'
        monstersDts += `${s.hash.substring(0, 2)}`

        let tabHash = [];
        let string = s.hash.substring(2, 62);
        tabHash = string.match(/.{6}/g)

        tabHash.forEach(h => {
          monstersDts += `<span class="block" style="color:#${h}; background-color:#${h}">${char}${char}</span>`
        });

        monstersDts += `${s.hash.substring(62)}`
        monstersDts += '</div></td></tr>';

        $('#monsterTab tbody').append(monstersDts);



      });


    }


  } catch (err) {

  }
}
