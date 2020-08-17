import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://appcontactos-a1718.firebaseio.com"
});

const db = admin.firestore();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.json({ mensaje: "Hola mundo desde funciones de firebase!" });
});



export const getGOTY = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.json("Hola mundo desde funciones de firebase!");
});


// express
const app = express();
app.use(cors({ origin: true }));

app.get('/goty', async (req, res) => {

    const gotyRef = db.collection('goty');
    const docSnap = await gotyRef.get();
    const juegos = docSnap.docs.map(doc => doc.data());
    res.json(juegos);
})

app.post('/goty/:id', async (req, res) => {

    const id = req.params.id;
    const gameRef = db.collection('goty').doc(id);
    const gameSnap = await gameRef.get();
    if (!gameSnap.exists) {
        res.status(404).json({ ok: false, mensaje: 'no existe el juego con ID ' + id });
    } else {
        res.json('juego existe');

        const antes = gameSnap.data() || { votos:0};
        // tslint:disable-next-line: no-floating-promises
        await gameRef.update({
            votos: antes.votos + 1
        });

        res.json({
            ok: true,
            mensaje: `Gracias por tu voto a ${antes.name}`
        });
    }

});

export const api = functions.https.onRequest(app);