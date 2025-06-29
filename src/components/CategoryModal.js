'use client';

import { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Modal from './Modal'; // Import the generic Modal component

export default function CategoryModal({
  selectedType,
  categories,
  fetchCategories,
  onClose,
  onAddCategory,
  onDeleteCategory,
}) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const handleAdd = async () => {
    await onAddCategory({ name: newCategoryName, type: selectedType });
    setNewCategoryName('');
  };

  const handleDelete = async (id) => {
    await onDeleteCategory(id);
  };

  const handleEditClick = (category) => {
    setEditingCategoryId(category._id);
    setEditingCategoryName(category.name);
  };

  const handleSaveEdit = async (id) => {
    if (!editingCategoryName) return;
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: editingCategoryName }),
    });

    if (res.ok) {
      setEditingCategoryId(null);
      setEditingCategoryName('');
      fetchCategories(selectedType); // Re-fetch categories to update the list
    } else {
      const errorData = await res.json();
      alert(errorData.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Edit ${selectedType === 'expense' ? 'Expense' : 'Income'} Categories`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
        <form onSubmit={handleAdd} className="flex">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="New category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="py-2 px-4 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
          >
            <FaPlus />
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Existing Categories</h3>
        {categories.length === 0 ? (
          <p>No categories yet.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => {
              return (
                <li key={category._id} className="flex justify-between items-center p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    {editingCategoryId === category._id ? (
                      <>
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="p-1 border rounded"
                        />
                      </>
                    ) : (
                      <>
                        <span>{category.name}</span>
                      </>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {editingCategoryId === category._id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(category._id)}
                          className="py-1 px-2 text-green-500 rounded text-sm hover:text-green-600 cursor-pointer"
                        >
                          <FaCheck />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="py-1 px-2 text-gray-500 rounded text-sm hover:text-gray-600 cursor-pointer"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(category)}
                          className="py-1 px-2 text-blue-500 rounded text-sm hover:text-blue-600 cursor-pointer"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(category._id)}
                      className="py-1 px-2 text-red-500 rounded text-sm hover:text-red-600 cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Modal>
  );
}
