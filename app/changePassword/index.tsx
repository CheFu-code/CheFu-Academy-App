import RenderInput from '@/component/ChangePassword/RenderInput';
import ChangePasswordUI from '@/component/Setting/ChangePasswordUI';
import { usePasswordHook } from '@/handlers/ChangePassword/Functions';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useState } from 'react';

export default function ChangePassword() {
    const { safeBack } = useSafeNavigation();
    const { handleChangePassword } = usePasswordHook();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading] = useState(false);
    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const renderInput = (
        label: string,
        value: string,
        setter: (text: string) => void,
        field: 'current' | 'new' | 'confirm',
    ) => (
        <RenderInput
            label={label}
            show={show}
            setShow={setShow}
            field={field}
            value={value}
            setter={setter}
        />
    );

    return (
        <ChangePasswordUI
            handleChangePassword={handleChangePassword}
            loading={loading}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            renderInput={renderInput}
            safeBack={safeBack}
        />
    );
}
