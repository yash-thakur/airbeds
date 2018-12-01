import Home from "../app/components/home";

export default [
  {
    path: "/",
    exact: true,
    component: Home,
    loadData: () => {
      return fetch("/api/getdata", {
        method: "GET",
      }).then(res => res.json()).then(data => data).catch(err => console.log(err));
    },
  },
];
