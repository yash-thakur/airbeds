import fetch from "universal-fetch";
import Home from "../app/components/home";

export default [
  {
    path: "/",
    exact: true,
    component: Home,
    loadData: () => {
      const url = "https://api.stay22.com/v2/hotelscombined?latitude=52.514050&longitude=13.344720&language=en&currency=USD";
      return fetch(url, {
        method: "GET",
      }).then(res => res.json()).then(data => data).catch(err => console.log(err));
    },
  },
];
