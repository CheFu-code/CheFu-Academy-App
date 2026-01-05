export type PermissionKeys =
    | 'camera'
    | 'mediaLibrary'
    | 'location'
    | 'notifications';
    
export interface PermissionsUIProps {
    permissions: Record<PermissionKeys, boolean>;
    requestPermission: (type: PermissionKeys) => Promise<void>;
    openSettings: () => void;
    permissionDisplayNames: Record<PermissionKeys, string>;
}
