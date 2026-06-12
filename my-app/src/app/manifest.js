export default function manifest() {
  return {
    name: "Corporación Promelab",
    short_name: "Promelab",
    description:
      "Venta de herramientas de laboratorio, equipo médico e instrumentos científicos.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#002366",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
