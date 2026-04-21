import { create } from "zustand";
export interface AgentModalInfoState {
    agentModalOpen: boolean;
    setAgentModalToggle: () => void;
    setAgentModalClose: () => void;
    setAgentModalOpen: () => void;
    agentSocialLinks: {
        agent: {username: string, avatar: {url: string}, bio: string},
        whatsapp?: string, 
        links?: {facebook?: string, instagram?: string, twitter?: string, linkedin?: string}
    };
    setAgentSocialLinks: (agentSocialLinks: {
        agent: {username: string, avatar: {url: string}, bio: string},
        whatsapp?: string, 
        links?: {facebook?: string, instagram?: string, twitter?: string, linkedin?: string}
    }) => void;
}
const useAgentModalInfoStore = create<AgentModalInfoState>((set) => ({
    agentModalOpen: false,
    setAgentModalToggle: () => set((state: AgentModalInfoState) => ({ agentModalOpen: !state.agentModalOpen })),
    setAgentModalClose: () => set({ agentModalOpen: false }),
    setAgentModalOpen: () => set({ agentModalOpen: true }),
    
    agentSocialLinks: {
        agent: {username: '', avatar: {url: ''}, bio: ''},
        whatsapp: '', 
        links: {facebook: '', instagram: '', twitter: '', linkedin: ''}
    },
    setAgentSocialLinks: (agentSocialLinks: AgentModalInfoState['agentSocialLinks']) => set({ agentSocialLinks }),
}))

export default useAgentModalInfoStore