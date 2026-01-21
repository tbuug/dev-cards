import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export default function MarkdownContent({ content }: { content: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
                pre({ children }) {
                return (
                    <pre
                    style={{
                        width: '100%',
                        overflowX: 'auto',
                        padding: '12px',
                        borderRadius: '6px',
                        background: '#f6f8fa',
                        textAlign: 'left',
                        fontSize: '12px'
                    }}
                    >
                    {children}
                    </pre>
                );
                },
                code({ inline, className, children }) {
                return inline ? (
                    <code
                    style={{
                        background: '#f6f8fa',
                        padding: '2px 4px',
                        borderRadius: '4px'
                    }}
                    >
                    {children}
                    </code>
                ) : (
                    <code className={className}>
                    {children}
                    </code>
                );
                }
            }}
            >

            {content}
        </ReactMarkdown>
    );
}
