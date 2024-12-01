export function exportProject() {
  try {
    // Get all data from localStorage
    const projects = localStorage.getItem('projects');
    const users = localStorage.getItem('vugru_users');
    const currentUser = localStorage.getItem('vugru_current_user');

    // Parse the data
    const projectsData = projects ? JSON.parse(projects) : [];
    const usersData = users ? JSON.parse(users) : [];
    const currentUserData = currentUser ? JSON.parse(currentUser) : null;

    // Create the export object
    const exportData = {
      projects: projectsData,
      users: usersData,
      currentUser: currentUserData,
      exportDate: new Date().toISOString()
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vugru-project-export.json';

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error exporting project:', error);
    return false;
  }
}