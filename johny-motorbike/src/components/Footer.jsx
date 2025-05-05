export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold">Johny Motorbike</p>
            <p className="text-sm text-gray-300">Las mejores rutas para tu aventura</p>
          </div>
          <div className="text-sm text-gray-300">
            <p>© {new Date().getFullYear()} Johny Motorbike. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}