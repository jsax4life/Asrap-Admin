import { useEffect, useState } from 'react';
import { Calendar, User, Search, Plus, Trash2, Loader2, Music2, Upload, Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { genreService, Genre } from '@/services/genreService';
import { APP_NAME } from '@/constants';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function GenreManagement() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');
  const [name, setName] = useState('');
  const [bulkNames, setBulkNames] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Genre | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState<Genre | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCoverImage, setEditCoverImage] = useState<File | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const loadGenres = async () => {
    setLoading(true);
    try {
      const data = await genreService.listGenres();
      setGenres(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec du chargement des genres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  const filteredGenres = genres.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setName('');
    setBulkNames('');
    setDescription('');
    setCoverImage(null);
  };

  const handleAddGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addMode === 'single' && !name.trim()) {
      toast.error('Le nom du genre est requis');
      return;
    }
    if (addMode === 'bulk' && !bulkNames.trim()) {
      toast.error('Saisissez au moins un nom de genre');
      return;
    }

    setSubmitting(true);
    try {
      const result = await genreService.addGenre({
        name: addMode === 'single' ? name : undefined,
        names: addMode === 'bulk' ? bulkNames : undefined,
        description: description || undefined,
        coverImage: coverImage || undefined,
      });
      toast.success(result.message || 'Genre(s) ajouté(s) avec succès');
      resetForm();
      await loadGenres();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec de l\'ajout du genre');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await genreService.deleteGenre(deleteTarget._id);
      toast.success(`"${deleteTarget.name}" supprimé`);
      setDeleteTarget(null);
      await loadGenres();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec de la suppression du genre');
    } finally {
      setDeleting(false);
    }
  };

  const openEditDialog = (genre: Genre) => {
    setEditTarget(genre);
    setEditName(genre.name);
    setEditDescription(genre.description || '');
    setEditCoverImage(null);
  };

  const closeEditDialog = (force = false) => {
    if (!force && editSubmitting) return;
    setEditTarget(null);
    setEditName('');
    setEditDescription('');
    setEditCoverImage(null);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    if (!editName.trim()) {
      toast.error('Le nom du genre est requis');
      return;
    }

    const payload: { name?: string; description?: string; coverImage?: File } = {};
    const trimmedName = editName.trim();
    const trimmedDescription = editDescription.trim();

    if (trimmedName !== editTarget.name) payload.name = trimmedName;
    if (trimmedDescription !== (editTarget.description || '')) payload.description = trimmedDescription;
    if (editCoverImage) payload.coverImage = editCoverImage;

    if (Object.keys(payload).length === 0) {
      toast.error('Aucune modification à enregistrer');
      return;
    }

    setEditSubmitting(true);
    try {
      const result = await genreService.updateGenre(editTarget._id, payload);
      toast.success(result.message || 'Genre mis à jour avec succès');
      closeEditDialog(true);
      await loadGenres();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec de la mise à jour du genre');
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-asra-dark">
      <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-asra-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white text-xl font-bold">{APP_NAME}</span>
            </div>
            <div className="flex items-center space-x-2 text-asra-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{new Date().toLocaleDateString('en-GB')}</span>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-white">Gestion des genres</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm">Admin</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6 min-w-0">
        <div className="xl:col-span-1 bg-asra-gray-1 rounded-lg border border-asra-gray-2 p-6 h-fit">
          <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-asra-red" />
            Ajouter un genre
          </h2>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setAddMode('single')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                addMode === 'single' ? 'bg-asra-red text-white' : 'bg-asra-gray-2 text-asra-gray-6'
              }`}
            >
              Un seul
            </button>
            <button
              type="button"
              onClick={() => setAddMode('bulk')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                addMode === 'bulk' ? 'bg-asra-red text-white' : 'bg-asra-gray-2 text-asra-gray-6'
              }`}
            >
              Plusieurs
            </button>
          </div>

          <form onSubmit={handleAddGenre} className="space-y-4">
            {addMode === 'single' ? (
              <div>
                <label className="text-white text-sm font-medium mb-1 block">Nom du genre *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex. Afrobeats"
                  className="w-full px-4 py-3 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red"
                />
              </div>
            ) : (
              <div>
                <label className="text-white text-sm font-medium mb-1 block">Noms des genres *</label>
                <textarea
                  value={bulkNames}
                  onChange={(e) => setBulkNames(e.target.value)}
                  placeholder="Hip Hop, R&B, Jazz, Gospel"
                  rows={3}
                  className="w-full px-4 py-3 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red resize-none"
                />
                <p className="text-asra-gray-6 text-xs mt-1">Séparez-les par des virgules</p>
              </div>
            )}

            <div>
              <label className="text-white text-sm font-medium mb-1 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description optionnelle"
                rows={2}
                className="w-full px-4 py-3 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red resize-none"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-1 block">Image de couverture</label>
              <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-asra-gray-2 border border-dashed border-asra-gray-5 rounded-lg text-asra-gray-6 cursor-pointer hover:border-asra-red transition-colors">
                <Upload className="w-4 h-4" />
                {coverImage ? coverImage.name : 'Téléverser une couverture (optionnel)'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-asra-red hover:bg-asra-red/90 disabled:opacity-60 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {submitting ? 'Ajout en cours...' : 'Ajouter le genre'}
            </button>
          </form>
        </div>

        <div className="xl:col-span-2 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher des genres"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red"
              />
            </div>
            <span className="text-asra-gray-6 text-sm whitespace-nowrap">{filteredGenres.length} actifs</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
            </div>
          ) : (
            <div className="bg-asra-gray-1 rounded-lg border border-asra-gray-2 overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-asra-gray-2">
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Genre</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4 min-w-[160px]">Description</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4 whitespace-nowrap">Statut</th>
                    <th className="text-right text-asra-gray-6 text-sm font-medium px-6 py-4 whitespace-nowrap sticky right-0 bg-asra-gray-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGenres.map((genre) => (
                    <tr key={genre._id} className="group border-b border-asra-gray-2 hover:bg-asra-gray-2/40">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-asra-gray-2 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {genre.coverImageUrl ? (
                              <img src={genre.coverImageUrl} alt={genre.name} className="w-full h-full object-cover" />
                            ) : (
                              <Music2 className="w-5 h-5 text-asra-gray-6" />
                            )}
                          </div>
                          <span className="text-white font-medium">{genre.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-asra-gray-6 text-sm max-w-[200px] truncate">
                        {genre.description || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Actif</span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap sticky right-0 bg-asra-gray-1 group-hover:bg-asra-gray-2/40">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditDialog(genre)}
                            className="text-asra-gray-6 hover:text-white p-2 rounded-lg hover:bg-asra-gray-2 transition-colors"
                            title="Modifier le genre"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(genre)}
                            className="text-asra-gray-6 hover:text-red-400 p-2 rounded-lg hover:bg-asra-gray-2 transition-colors"
                            title="Supprimer le genre"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              {filteredGenres.length === 0 && (
                <p className="text-center text-asra-gray-6 py-12">Aucun genre trouvé</p>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier le genre</DialogTitle>
            <DialogDescription className="text-asra-gray-6">
              Modifiez le nom, la description ou l'image de couverture de &quot;{editTarget?.name}&quot;.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSave} className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-1 block">Nom du genre *</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-1 block">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description optionnelle"
                rows={3}
                className="w-full px-4 py-3 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red resize-none"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-1 block">Image de couverture</label>
              {editTarget?.coverImageUrl && !editCoverImage && (
                <div className="mb-2 flex items-center gap-3">
                  <img
                    src={editTarget.coverImageUrl}
                    alt={editTarget.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="text-asra-gray-6 text-xs">Couverture actuelle</span>
                </div>
              )}
              <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-asra-gray-2 border border-dashed border-asra-gray-5 rounded-lg text-asra-gray-6 cursor-pointer hover:border-asra-red transition-colors">
                <Upload className="w-4 h-4" />
                {editCoverImage ? editCoverImage.name : 'Remplacer la couverture (optionnel)'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => setEditCoverImage(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={closeEditDialog}
                disabled={editSubmitting}
                className="border-asra-gray-5 text-white hover:bg-asra-gray-2 hover:text-white"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={editSubmitting}
                className="bg-asra-red hover:bg-asra-red/90 text-white"
              >
                {editSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le genre ?</AlertDialogTitle>
            <AlertDialogDescription className="text-asra-gray-6">
              « {deleteTarget?.name} » sera désactivé et masqué de la liste publique des genres. Cela ne supprime pas
              les titres déjà associés à ce genre.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-asra-gray-2 border-asra-gray-2 text-white hover:bg-asra-gray-800">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-asra-red hover:bg-asra-red/90"
            >
              {deleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
