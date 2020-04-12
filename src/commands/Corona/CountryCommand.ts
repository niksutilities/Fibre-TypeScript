import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";
import moment from "moment"

export default class CountrylistCommand extends Command {
  public constructor() {
    super("country", {
      aliases: ["country"],
      category: "Corona",
      args: [
        {
          id: "country",
          type: "string",
          match: "rest",
          prompt:{
            start: "What country would you like to search?"
          }
        }
      ],
      description: {
        content: "Countrylist Command",
        usage: "country [country]",
        examples: ["country UK", "country ireland"]
      },
    });
  }

  public async exec(message: Message, { country }: { country: any }) {
    const data = await fetch('https://corona.lmao.ninja/countries').then(res => res.json())
    const found = data.filter(u => u['country'].toLowerCase() == country.toLowerCase())[0]
    const check = data.filter(u => u['country'].toLowerCase() == country.toLowerCase())
    if(!check.length) return message.util!.send(new this.client.Embed()
        .setDescription("Invalid Country \n Check +countrylist for Countries")
    )

    console.log(found)

    message.util!.send(new this.client.Embed()
        .setTitle(`${found.country}'s Statistics`)
        .addField("Location:", `${found.countryInfo.long} Longitude, ${found.countryInfo.lat} Latitude`)
        .addField("Cases:", found.cases.toLocaleString(), true)
        .addField("Today Cases:", found.todayCases.toLocaleString(), true)
        .addField("Deaths:", found.deaths.toLocaleString(), true)
        .addField("Today Deaths:", found.todayDeaths.toLocaleString(), true)
        .addField("Recovered:", found.recovered.toLocaleString(), true)
        .addField("Active Cases:", found.active.toLocaleString(), true)
        .addField("Critical Cases:", found.critical.toLocaleString(),true)
        .addField("Tests:", found.tests == 0 ? "Unknown" : found.tests.toLocaleString(),true)
        .addField("Positive Tests Rate:", found.tests == 0 ? "Unknown" : `${(found.tests / found.cases).toFixed(2)}%` , true)

        .addField("Recovery Rate:", found.cases)

        .addField("Cases Per Million:", found.casesPerOneMillion.toLocaleString(), true)
        .addField("Deaths Per Million:", found.deathsPerOneMillion.toLocaleString(), true)
        .addField("Tests Per Million:", found.testsPerOneMillion == 0 ? "Unknown" : found.testsPerOneMillion.toLocaleString(),true)
        .setThumbnail(found.countryInfo.flag)
        .setFooter(`Last Updated: ${moment(found.updated).format("DD/MMM/YYYY hh:mm")}`)
    )
  }
}