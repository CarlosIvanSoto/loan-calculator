import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Printer, ShoppingBag, ImageIcon, Mail, MessageCircle } from 'lucide-react'

export default function LoadingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-zinc-900 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
            DISEÑOS
          </h1>
          <p className="text-xl md:text-2xl text-yellow-400 font-semibold">
            IMPRESIONES, TARJETAS, ETIQUETAS ADHESIVAS Y STICKERS
          </p>
          <div className="flex gap-4">
            <Button className="bg-green-600 hover:bg-green-700 font-bold">
              <MessageCircle /> WhatsApp: 871 761 5381
            </Button>
            <Button variant="outline">
              Ver Catálogo
            </Button>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 space-y-2">
                <Printer className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Impresiones</h3>
                <p className="text-muted-foreground">
                  Servicios profesionales de impresión para todo tipo de necesidades
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-2">
                <ImageIcon className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Diseño Gráfico</h3>
                <p className="text-muted-foreground">
                  Creación de diseños personalizados para tu negocio
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-2">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Productos</h3>
                <p className="text-muted-foreground">
                  Amplia gama de productos personalizables
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Products Tabs */}
          <Tabs defaultValue="ropa" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="ropa">Ropa Personalizada</TabsTrigger>
              <TabsTrigger value="impresiones">Impresiones</TabsTrigger>
              <TabsTrigger value="publicidad">Publicidad</TabsTrigger>
            </TabsList>
            <TabsContent value="ropa" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="aspect-square relative bg-zinc-100 rounded-lg overflow-hidden">
                      <img
                        src="/placeholder.svg"
                        alt="Playeras personalizadas"
                        className="object-cover"
                        width={300}
                        height={300}
                      />
                    </div>
                    <h4 className="mt-2 font-semibold">Playeras</h4>
                    <p className="text-sm text-muted-foreground">
                      Dama y Caballero, manga corta y larga
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="aspect-square relative bg-zinc-100 rounded-lg overflow-hidden">
                      <img
                        src="/placeholder.svg"
                        alt="Uniformes deportivos"
                        className="object-cover"
                        width={300}
                        height={300}
                      />
                    </div>
                    <h4 className="mt-2 font-semibold">Uniformes Deportivos</h4>
                    <p className="text-sm text-muted-foreground">
                      Fútbol, básquet, ciclismo
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="aspect-square relative bg-zinc-100 rounded-lg overflow-hidden">
                      <img
                        src="/placeholder.svg"
                        alt="Sudaderas personalizadas"
                        className="object-cover"
                        width={300}
                        height={300}
                      />
                    </div>
                    <h4 className="mt-2 font-semibold">Sudaderas</h4>
                    <p className="text-sm text-muted-foreground">
                      Personalizadas para equipos y empresas
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            {/* Other tab contents would go here */}
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">DISEÑOS & PUBLICIDAD</h2>
            <p className="text-zinc-400">Negocios, Escuela, Hogar, Fiestas, Eventos y Redes Sociales</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">
              <Phone /> Llamar
            </Button>
            <Button variant="outline">
              <Mail /> Email
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}