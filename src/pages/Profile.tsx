import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth, signOut, updatePassword, deleteAccount, authErrorMessage } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Heart, LogOut, Bell, Shield, Camera, Trash2 } from 'lucide-react';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [changing, setChanging] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setCity(profile.city ?? '');
      setPhone(profile.phone ?? '');
    }
  }, [profile]);

  useEffect(() => {
    let active = true;
    const resolveAvatar = async () => {
      const value = profile?.avatar_url;
      if (!value) {
        setAvatarSrc(null);
        return;
      }
      if (value.startsWith('http')) {
        setAvatarSrc(value);
        return;
      }
      const { data } = await supabase.storage.from('avatars').createSignedUrl(value, 3600);
      if (active) setAvatarSrc(data?.signedUrl ?? null);
    };
    resolveAvatar();
    return () => {
      active = false;
    };
  }, [profile?.avatar_url]);

  const initials = (profile?.full_name || user?.email || '?')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name: fullName || null, city: city || null, phone: phone || null });
    setSaving(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      await refreshProfile();
      toast({ title: 'Profil mis à jour', description: 'Vos informations ont bien été enregistrées.' });
    }
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Fichier trop volumineux', description: 'La photo ne doit pas dépasser 2 Mo.', variant: 'destructive' });
      return;
    }
    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) {
      setUploading(false);
      toast({ title: 'Erreur', description: uploadError.message, variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('profiles').upsert({ id: user.id, avatar_url: path });
    setUploading(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      await refreshProfile();
      toast({ title: 'Photo mise à jour' });
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: 'Mot de passe trop court', description: '8 caractères minimum.', variant: 'destructive' });
      return;
    }
    if (password !== confirm) {
      toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas.', variant: 'destructive' });
      return;
    }
    setChanging(true);
    const { error } = await updatePassword(password);
    setChanging(false);
    if (error) {
      toast({ title: 'Erreur', description: authErrorMessage(error.message), variant: 'destructive' });
    } else {
      setPassword('');
      setConfirm('');
      toast({ title: 'Mot de passe modifié' });
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await deleteAccount();
    setDeleting(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return;
    }
    await signOut();
    toast({ title: 'Compte supprimé', description: 'Votre compte et vos données ont été supprimés.' });
    navigate('/', { replace: true });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Mon compte</h1>
          <p className="text-muted-foreground">Gérez votre profil et vos préférences.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-2">
            <Button variant="secondary" className="w-full justify-start">
              <User className="w-4 h-4 mr-2" /> Profil
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/compte/mes-clubs/"><Heart className="w-4 h-4 mr-2" /> Mes clubs</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/compte/notifications/"><Bell className="w-4 h-4 mr-2" /> Notifications</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/compte/mon-club/"><Shield className="w-4 h-4 mr-2" /> Mon club</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Déconnexion
            </Button>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Informations personnelles</h2>

              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-20 h-20">
                  {avatarSrc && <AvatarImage src={avatarSrc} alt="Photo de profil" />}
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleAvatar}
                  />
                  <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                    Changer la photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG ou WebP — 2 Mo max.</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email ?? ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Votre nom" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Paris" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78" />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Enregistrer
                </Button>
              </form>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Sécurité</h2>
              <form onSubmit={handlePassword} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8 caractères minimum"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" variant="outline" disabled={changing || !password}>
                  {changing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Modifier le mot de passe
                </Button>
              </form>
            </div>

            <div className="bg-card border border-destructive/30 rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold mb-2">Supprimer mon compte</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Cette action est définitive : votre profil, vos favoris et votre photo seront supprimés.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={deleting}>
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    Supprimer mon compte
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer définitivement votre compte ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Toutes vos données personnelles seront effacées. Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
