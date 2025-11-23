import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Alleen POST'});
  const {type, params} = req.body;
  let prompt = "";
  if(type==="nda") prompt = `Maak een volledige Nederlandstalige geheimhoudingsovereenkomst tussen "${params.a}" (openbaarmakende partij) en "${params.b}" (ontvangende partij) voor "${params.c}". Inclusief alle standaardclausules (duur 5 jaar, boete, etc.).`;
  if(type==="diensten") prompt = `Maak een volledige Nederlandstalige dienstenovereenkomst tussen opdrachtgever "${params.a}" en opdrachtnemer "${params.b}" voor "${params.c}", bedrag €${params.d}. Inclusief alle standaardclausules.`;
  if(type==="freelance") prompt = `Maak een volledige Nederlandstalige freelance/opdrachtovereenkomst tussen opdrachtgever "${params.a}" en freelancer "${params.b}" voor "${params.c}", tarief €${params.d}.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{role:"system", content:"Je bent een Belgische/Nederlandse jurist die duidelijke contracten schrijft voor KMO's."},{role:"user", content:prompt}]
  });
  res.status(200).json({text: completion.choices[0].message.content});
}
