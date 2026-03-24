import { redirect } from 'next/navigation';
import { getAuthStatus } from '@/lib/auth';
import { getAllPlatformsWithStats } from '@/lib/kv';
import { Platform } from '@/lib/types';
import PlatformTable from './PlatformTable';

export default async function AdminDashboard() {
  const isAuthenticated = await getAuthStatus();

  if (!isAuthenticated) {
    redirect('/admin');
  }

  const platforms = await getAllPlatformsWithStats();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">平台管理</h1>
            <div className="flex gap-4">
              <a
                href="/"
                target="_blank"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                查看网站
              </a>
              <form action="/api/admin/logout" method="POST">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  退出登录
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">平台列表</h2>
                <button
                  id="addPlatformBtn"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  添加平台
                </button>
              </div>

              <PlatformTable platforms={platforms} />
            </div>
          </div>
        </div>
      </div>

      {/* Platform Form Modal */}
      <div id="platformModal" className="fixed inset-0 bg-gray-500 bg-opacity-75 hidden z-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 id="modalTitle" className="text-lg font-medium text-gray-900">添加平台</h3>
                <button id="closeModalBtn" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">关闭</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form id="platformForm" className="space-y-4">
                <input type="hidden" id="platformId" name="id" />

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    平台名称 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>

                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                    Logo URL *
                  </label>
                  <input
                    type="url"
                    id="logo"
                    name="logo"
                    required
                    placeholder="/logos/example.svg"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>

                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                    优惠信息 *
                  </label>
                  <input
                    type="text"
                    id="discount"
                    name="discount"
                    required
                    placeholder="例如: Pro会员8折"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>

                <div>
                  <label htmlFor="affiliateUrl" className="block text-sm font-medium text-gray-700">
                    分销链接 *
                  </label>
                  <input
                    type="url"
                    id="affiliateUrl"
                    name="affiliateUrl"
                    required
                    placeholder="https://example.com/referral"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    描述 *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                    启用此平台
                  </label>
                </div>

                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                    排序顺序
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    min="1"
                    defaultValue="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    id="cancelBtn"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        const modal = document.getElementById('platformModal');
        const addBtn = document.getElementById('addPlatformBtn');
        const closeBtn = document.getElementById('closeModalBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const form = document.getElementById('platformForm');
        const modalTitle = document.getElementById('modalTitle');

        function openModal(platform = null) {
          if (platform) {
            modalTitle.textContent = '编辑平台';
            document.getElementById('platformId').value = platform.id;
            document.getElementById('name').value = platform.name;
            document.getElementById('logo').value = platform.logo;
            document.getElementById('discount').value = platform.discount;
            document.getElementById('affiliateUrl').value = platform.affiliateUrl;
            document.getElementById('description').value = platform.description;
            document.getElementById('active').checked = platform.active;
            document.getElementById('order').value = platform.order;
          } else {
            modalTitle.textContent = '添加平台';
            form.reset();
            document.getElementById('platformId').value = '';
          }
          modal.classList.remove('hidden');
        }

        function closeModal() {
          modal.classList.add('hidden');
        }

        addBtn.addEventListener('click', () => openModal());
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
        });

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const id = formData.get('id');
          const isNew = !id;

          const data = {
            id: id || 'platform_' + Date.now(),
            name: formData.get('name'),
            logo: formData.get('logo'),
            discount: formData.get('discount'),
            affiliateUrl: formData.get('affiliateUrl'),
            description: formData.get('description'),
            active: formData.get('active') === 'on',
            order: parseInt(formData.get('order')) || 1,
          };

          try {
            const response = await fetch('/api/admin/platforms', {
              method: isNew ? 'POST' : 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });

            if (response.ok) {
              window.location.reload();
            } else {
              const error = await response.json();
              alert('保存失败: ' + (error.error || '未知错误'));
            }
          } catch (error) {
            alert('保存失败: ' + error.message);
          }
        });

        window.editPlatform = function(platform) {
          openModal(platform);
        };

        window.deletePlatform = async function(id) {
          if (!confirm('确定要删除此平台吗？此操作不可撤销。')) return;

          try {
            const response = await fetch('/api/admin/platforms?id=' + id, {
              method: 'DELETE',
            });

            if (response.ok) {
              window.location.reload();
            } else {
              const error = await response.json();
              alert('删除失败: ' + (error.error || '未知错误'));
            }
          } catch (error) {
            alert('删除失败: ' + error.message);
          }
        };
      `}} />
    </div>
  );
}
