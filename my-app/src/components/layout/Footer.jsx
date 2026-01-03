"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[#E5E7EB] bg-[#F5F7FA]">
      <div className="container-promelab py-14">
        
        {/* GRID HORIZONTAL */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">

          {/* PROMELAB */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#002366]">
              PROMELAB
            </h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Plataforma de abastecimiento científico para laboratorios,
              industria y profesionales técnicos.
            </p>
          </div>

          {/* COMPAÑÍA */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#374151]">
              Compañía
            </h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li><Link href="/about">Nosotros</Link></li>
              <li><Link href="/contact">Contacto</Link></li>
              <li><Link href="/">Certificaciones</Link></li>
              <li><Link href="/">Carreras</Link></li>
            </ul>
          </div>

          {/* SOPORTE */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#374151]">
              Soporte
            </h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li><Link href="/help">Centro de ayuda</Link></li>
              <li><Link href="/">Envíos</Link></li>
              <li><Link href="/">Devoluciones</Link></li>
              <li><Link href="/">Documentación</Link></li>
            </ul>
          </div>

          {/* SERVICIOS */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#374151]">
              Servicios
            </h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li><Link href="/">Cotización</Link></li>
              <li><Link href="/">Órdenes al por mayor</Link></li>
              <li><Link href="/">Calibración</Link></li>
            </ul>
          </div>

          {/* CONTACTO */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#374151]">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>+51 972 719 164</li>
              <li>ventas@promelab.com</li>
              <li className="text-xs leading-relaxed pt-2">
                <a
                  href="https://www.google.com/maps/place/PROMELAB+E.I.R.L/@-12.046074,-77.0411999,852m/data=!3m2!1e3!4b1!4m6!3m5!1s0x9105c95092385241:0xd57b5cc6cc1e3818!8m2!3d-12.046074!4d-77.038625!16s%2Fg%2F11kwrnz_0j?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#002366] transition-colors"
                >
                  Jr Chancay 627 Int. 107 – Promelab<br />
                  Cercado de Lima – Lima, Perú
                </a>
              </li>
              <li className="text-xs leading-relaxed pt-2">
                <a
                  href="https://www.google.com/maps/place/Jr.+Libertad+338,+Huancayo+12001/@-12.0711277,-75.2203302,3407m/data=!3m1!1e3!4m6!3m5!1s0x910e96457d131181:0x5e4f3c0a53bce7d6!8m2!3d-12.0695221!4d-75.2129634!16s%2Fg%2F11f12rn7xl?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#002366] transition-colors"
                >
                  Jr Libertad 338 – Huancayo, Perú
                </a>
              </li>

            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-12 border-t border-[#E5E7EB] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>&copy; {year} PROMELAB. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/">Privacidad</Link>
            <Link href="/">Términos</Link>
            <Link href="/">Cumplimiento</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
