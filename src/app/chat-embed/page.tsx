import ChatWidget from '../components/ChatWidget'

export default function ChatEmbedPage() {
    return (
        <div style={{ height: '100dvh', overflow: 'hidden' }}>
            <ChatWidget embedded={true} />
        </div>
    )
}