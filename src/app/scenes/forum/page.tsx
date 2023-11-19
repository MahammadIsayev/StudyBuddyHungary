import React from 'react'
import { SelectedPage } from '@/app/shared/types';

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
};

const Forum = ({ setSelectedPage }: Props) => {
    return (
        <section id="forum">
            <div className='bg-white'>Discussion Forum</div>
        </section>
    )
}

export default Forum;