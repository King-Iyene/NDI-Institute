import { useState, useEffect } from "react";
import { useAuth, apiFetch } from "../auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Search, Shield, Trash2, Edit } from "lucide-react";

interface UserRow {
  id: number; email: string; firstName: string; lastName: string;
  role: "student" | "teacher" | "admin" | "super_admin";
  avatar: string | null; phone: string | null; createdAt: string;
}

const roleBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  student: "secondary", teacher: "default", admin: "outline", super_admin: "destructive",
};
const roleLabels: Record<string, string> = { student: "Student", teacher: "Teacher", admin: "Admin", super_admin: "Super Admin" };

export function UsersPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ email: "", password: "", firstName: "", lastName: "", role: "student" });
  const [editingRole, setEditingRole] = useState<{ id: number; role: string } | null>(null);

  const isSuperAdmin = user?.role === "super_admin";

  useEffect(() => {
    apiFetch("/users", { token: token! }).then(setUsers).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  async function createUser() {
    try {
      await apiFetch("/auth/register", { method: "POST", body: JSON.stringify(createForm), token: token! });
      const updated = await apiFetch("/users", { token: token! });
      setUsers(updated);
      setShowCreate(false);
      setCreateForm({ email: "", password: "", firstName: "", lastName: "", role: "student" });
    } catch (err: any) { alert(err.message); }
  }

  async function updateRole() {
    if (!editingRole) return;
    try {
      await apiFetch(`/users/${editingRole.id}/role`, { method: "PUT", body: JSON.stringify({ role: editingRole.role }), token: token! });
      const updated = await apiFetch("/users", { token: token! });
      setUsers(updated);
      setEditingRole(null);
    } catch (err: any) { alert(err.message); }
  }

  async function deleteUser(id: number) {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      await apiFetch(`/users/${id}`, { method: "DELETE", token: token! });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) { alert(err.message); }
  }

  const filtered = users.filter((u) => {
    const matchSearch = !search || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const counts = { all: users.length, student: users.filter((u) => u.role === "student").length, teacher: users.filter((u) => u.role === "teacher").length, admin: users.filter((u) => u.role === "admin").length, super_admin: users.filter((u) => u.role === "super_admin").length };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">User Management</h1><p className="text-gray-500 mt-1">{users.length} total users</p></div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add User</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create a new user</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>First Name</Label><Input value={createForm.firstName} onChange={(e) => setCreateForm((f) => ({ ...f, firstName: e.target.value }))} /></div>
                <div><Label>Last Name</Label><Input value={createForm.lastName} onChange={(e) => setCreateForm((f) => ({ ...f, lastName: e.target.value }))} /></div>
              </div>
              <div><Label>Email</Label><Input type="email" value={createForm.email} onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))} /></div>
              <div><Label>Password</Label><Input type="password" value={createForm.password} onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))} /></div>
              <div><Label>Role</Label>
                <Select value={createForm.role} onValueChange={(v) => setCreateForm((f) => ({ ...f, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    {isSuperAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createUser} disabled={!createForm.email || !createForm.password || !createForm.firstName || !createForm.lastName} className="w-full">Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input className="pl-9" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <Tabs value={roleFilter} onValueChange={setRoleFilter}>
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="student">Students ({counts.student})</TabsTrigger>
            <TabsTrigger value="teacher">Teachers ({counts.teacher})</TabsTrigger>
            <TabsTrigger value="admin">Admins ({counts.admin})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? <p className="text-gray-500 text-center py-8">No users found.</p> : filtered.map((u) => (
          <div key={u.id} className="flex items-center justify-between p-4 rounded-lg border bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">{u.firstName[0]}{u.lastName[0]}</div>
              <div>
                <p className="font-medium">{u.firstName} {u.lastName}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={roleBadgeVariant[u.role]}>{roleLabels[u.role]}</Badge>
              <span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</span>
              {isSuperAdmin && u.id !== user?.id && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditingRole({ id: u.id, role: u.role })}><Shield className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteUser(u.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change User Role</DialogTitle></DialogHeader>
          {editingRole && (
            <div className="space-y-4 mt-4">
              <Select value={editingRole.role} onValueChange={(v) => setEditingRole((e) => e && { ...e, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={updateRole} className="w-full">Update Role</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
