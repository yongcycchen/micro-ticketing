import axios from "axios";
const cookie =
  "express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall4TXpsaFlqbGpaak0wTnpoa05tTTFOems1T0RRNU1DSXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCMFpHUm1aSE5sTG1OdmJTSXNJbWxoZENJNk1UWXpNVEUyT1RRek5uMC5lX2wwNEdraVY0cG9aemxZLXpmMnEtaGhXbk00RkttOFRORnAtaGZhRW1zIn0=; Path=/; Secure; HttpOnly;";

const doRequest = async () => {
  const { data } = await axios.post(
    `https://ticketing.dev/api/tickets`,
    {
      title: "ticket",
      price: 5,
    },
    { headers: { cookie } }
  );
  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    {
      title: "ticket",
      price: 10,
    },
    { headers: { cookie } }
  );
  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    {
      title: "ticket",
      price: 15,
    },
    { headers: { cookie } }
  );
  console.log("request complete");
};

(async () => {
  for (let i = 0; i < 400; i++) {
    await doRequest();
  }
  //   try {
  //     await axios.post(
  //       `https://ticketing.dev/api/tickets`,
  //       {
  //         title: "ticket",
  //         price: 5,
  //       },
  //       { headers: { cookie } }
  //     );
  //     console.log("slkjfjh");
  //   } catch (err) {
  //     console.log(err);
  //   }
})();
