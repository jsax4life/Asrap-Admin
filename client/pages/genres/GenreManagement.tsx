import { useEffect, useState } from 'react';
import { Calendar, User, Search, Plus, Trash2, Loader2, Music2, Upload } from 'lucide-react';
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

  const loadGenres = async () => {
    setLoading(true);
    try {
      const data = await genreService.listGenres();
      setGenres(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load genres');
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
      toast.error('Genre name is required');
      return;
    }
    if (addMode === 'bulk' && !bulkNames.trim()) {
      toast.error('Enter at least one genre name');
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
      toast.success(result.message || 'Genre(s) added successfully');
      resetForm();
      await loadGenres();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add genre');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await genreService.deleteGenre(deleteTarget._id);
      toast.success(`"${deleteTarget.name}" removed`);
      setDeleteTarget(null);
      await loadGenres();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete genre');
    } finally {
      setDeleting(false);
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
            <h1 className="text-2xl font-bold text-white">Genre Management</h1>
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
            Add Genre
          </h2>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setAddMode('single')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                addMode === 'single' ? 'bg-asra-red text-white' : 'bg-asra-gray-2 text-asra-gray-6'
              }`}
            >
              Single
            </button>
            <button
              type="button"
              onClick={() => setAddMode('bulk')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                addMode === 'bulk' ? 'bg-asra-red text-white' : 'bg-asra-gray-2 text-asra-gray-6'
              }`}
            >
              Multiple
            </button>
          </div>

          <form onSubmit={handleAddGenre} className="space-y-4">
            {addMode === 'single' ? (
              <div>
                <label className="text-white text-sm font-medium mb-1 block">Genre name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Afrobeats"
                  className="w-full px-4 py-3 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red"
                />
              </div>
            ) : (
              <div>
                <label className="text-white text-sm font-medium mb-1 block">Genre names *</label>
                <textarea
                  value={bulkNames}
                  onChange={(e) => setBulkNames(e.target.value)}
                  placeholder="Hip Hop, R&B, Jazz, Gospel"
                  rows={3}
                  className="w-full px-4 py-3 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red resize-none"
                />
                <p className="text-asra-gray-6 text-xs mt-1">Separate with commas</p>
              </div>
            )}

            <div>
              <label className="text-white text-sm font-medium mb-1 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                rows={2}
                className="w-full px-4 py-3 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red resize-none"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-1 block">Cover image</label>
              <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-asra-gray-2 border border-dashed border-asra-gray-5 rounded-lg text-asra-gray-6 cursor-pointer hover:border-asra-red transition-colors">
                <Upload className="w-4 h-4" />
                {coverImage ? coverImage.name : 'Upload cover (optional)'}
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
              {submitting ? 'Adding...' : 'Add Genre'}
            </button>
          </form>
        </div>

        <div className="xl:col-span-2 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search genres"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red"
              />
            </div>
            <span className="text-asra-gray-6 text-sm whitespace-nowrap">{filteredGenres.length} active</span>
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
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4 whitespace-nowrap">Status</th>
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
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Active</span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap sticky right-0 bg-asra-gray-1 group-hover:bg-asra-gray-2/40">
                        <button
                          onClick={() => setDeleteTarget(genre)}
                          className="text-asra-gray-6 hover:text-red-400 p-2 rounded-lg hover:bg-asra-gray-2 transition-colors"
                          title="Remove genre"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              {filteredGenres.length === 0 && (
                <p className="text-center text-asra-gray-6 py-12">No genres found</p>
              )}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove genre?</AlertDialogTitle>
            <AlertDialogDescription className="text-asra-gray-6">
              "{deleteTarget?.name}" will be deactivated and hidden from the public genre list. This does not delete
              songs already tagged with this genre.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-asra-gray-2 border-asra-gray-2 text-white hover:bg-asra-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-asra-red hover:bg-asra-red/90"
            >
              {deleting ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
