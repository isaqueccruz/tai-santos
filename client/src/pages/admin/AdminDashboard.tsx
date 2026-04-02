import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBag, Tag, MessageSquare, Plus, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: products } = trpc.products.list.useQuery({});
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: messages } = trpc.contact.listMessages.useQuery();
  const { data: unreadCount } = trpc.contact.unreadCount.useQuery();

  const stats = [
    {
      label: "Produtos",
      value: products?.length ?? 0,
      icon: ShoppingBag,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/admin/produtos",
    },
    {
      label: "Categorias",
      value: categories?.length ?? 0,
      icon: Tag,
      color: "text-accent-foreground",
      bg: "bg-accent/20",
      href: "/admin/categorias",
    },
    {
      label: "Mensagens",
      value: messages?.length ?? 0,
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/mensagens",
    },
    {
      label: "Não lidas",
      value: unreadCount ?? 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
      href: "/admin/mensagens",
    },
  ];

  const quickActions = [
    { label: "Novo Produto", href: "/admin/produtos/novo", icon: Plus, desc: "Adicionar produto ao catálogo" },
    { label: "Nova Categoria", href: "/admin/categorias", icon: Tag, desc: "Criar categoria de produtos" },
    { label: "Ver Mensagens", href: "/admin/mensagens", icon: MessageSquare, desc: "Responder clientes" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="font-serif text-2xl font-semibold text-sidebar-foreground">
            Bem-vinda, {user?.name?.split(" ")[0] ?? "Admin"}! 👋
          </h1>
          <p className="text-sidebar-foreground/60 text-sm mt-1">
            Gerencie sua confeitaria a partir deste painel.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={stat.href}>
                <div className="bg-sidebar-accent rounded-xl p-4 cursor-pointer hover:bg-sidebar-accent/80 transition-colors border border-sidebar-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-sidebar-foreground">{stat.value}</p>
                  <p className="text-xs text-sidebar-foreground/60 mt-0.5">{stat.label}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-serif text-lg font-semibold text-sidebar-foreground mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <Link href={action.href}>
                  <div className="bg-sidebar-accent rounded-xl p-5 cursor-pointer hover:bg-sidebar-accent/80 transition-all border border-sidebar-border group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                        <action.icon className="w-4 h-4 text-sidebar-primary" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-sidebar-foreground/30 group-hover:text-sidebar-primary transition-colors" />
                    </div>
                    <p className="font-medium text-sidebar-foreground text-sm">{action.label}</p>
                    <p className="text-xs text-sidebar-foreground/50 mt-1">{action.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        {products && products.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-sidebar-foreground">Produtos Recentes</h2>
              <Link href="/admin/produtos">
                <Button variant="ghost" size="sm" className="text-sidebar-primary hover:text-sidebar-primary gap-1 text-xs">
                  Ver todos <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="bg-sidebar-accent rounded-xl border border-sidebar-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sidebar-border">
                    <th className="text-left px-4 py-3 text-xs text-sidebar-foreground/50 font-medium uppercase tracking-wider">Produto</th>
                    <th className="text-left px-4 py-3 text-xs text-sidebar-foreground/50 font-medium uppercase tracking-wider hidden sm:table-cell">Preço</th>
                    <th className="text-left px-4 py-3 text-xs text-sidebar-foreground/50 font-medium uppercase tracking-wider hidden md:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((p) => (
                    <tr key={p.id} className="border-b border-sidebar-border/50 last:border-0 hover:bg-sidebar-border/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.imageUrl && (
                            <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                          )}
                          <span className="font-medium text-sidebar-foreground truncate max-w-[150px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sidebar-foreground/70 hidden sm:table-cell">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(parseFloat(p.price))}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.available ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                        }`}>
                          {p.available ? "Disponível" : "Indisponível"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
