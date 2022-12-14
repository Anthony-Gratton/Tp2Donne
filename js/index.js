const SERVICE_URL = "https://api.andromia.science/monsters/atlas";

$(document).ready(() => {
    //Appeler lorsque la page a terminé de charger
    retrieveMonsters();
});

async function retrieveMonsters() {
    try {
        const response = await axios.get(SERVICE_URL);
        console.log(response);
        if (response.status === 200) {
            const monsters = response.data;

            console.log(monsters)

            monsters.forEach(m => {
                let monstersTr = '<tr>';
                monstersTr += `<td class="textCenter">${m.atlasNumber}<img class="monsters" src="${m.assets}"/></td><td class="textCenter"><a href="details.html?atlasNumber=${m.atlasNumber}">${m.name}</a></td><td class="textCenter">[${m.health.min} - ${m.health.max}]</td><td class="textCenter">[${m.damage.min} - ${m.damage.max}]</td><td class="textCenter">[${m.speed.min} - ${m.speed.max}]</td><td class="textCenter">[${(m.critical.min * 100).toFixed(2)} - ${(m.critical.max * 100).toFixed(2)}]%</td>`;
                monstersTr += '</tr>';

                $('#monsters tbody').append(monstersTr);
            });

        }


    } catch (err) {

    }
}
