import React, { useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import styles from './styles.module.css';

interface EncoderTemplateProps {
    name: string;
    description: string;
    packageName: string;
    importPath: string;
    dependencies?: string[];
    installationNotes?: string;
    usageExample: string;
    decodeExample?: string;
    notes?: string[];
    links?: Array<{
        text: string;
        url: string;
    }>;
}

function extractEncoderName(pkg: string) {
    const parts = pkg.split('/');
    return parts[parts.length - 1];
}

export default function EncoderTemplate({
    name,
    description,
    packageName,
    importPath,
    dependencies = [],
    installationNotes,
    usageExample,
    decodeExample,
    notes = [],
    links = [],
}: EncoderTemplateProps) {
    const [latestVersion, setLatestVersion] = useState<string>('');
    const [installCmd, setInstallCmd] = useState<string>(`go get ${importPath}`);

    useEffect(() => {
        const encoder = extractEncoderName(packageName).toLowerCase();
        fetch('https://api.github.com/repos/kivigo/encoders/tags?per_page=100')
            .then(res => res.json())
            .then((tags: { name: string }[]) => {
                const filtered = tags
                    .map(tag => tag.name)
                    .filter(tag => tag.startsWith(`${encoder}/`))
                    .map(tag => tag.split('/')[1]);
                if (filtered.length > 0) {
                    setLatestVersion(filtered[0]);
                    setInstallCmd(`go get ${importPath}@${filtered[0]}`);
                }
            })
            .catch(() => {
                setLatestVersion('');
                setInstallCmd(`go get ${importPath}`);
            });
    }, [importPath, packageName]);

    const encoderName = extractEncoderName(packageName).toLowerCase();
    const tagsUrl = `https://github.com/kivigo/encoders/tags?q=${encoderName}%2F`;

    return (
        <div className={styles['encoder-template']}>
            <div className={styles['encoder-header']}>
                <div className={styles.badges}>
                    <span className={`${styles.badge} ${styles['badge-green']}`}>{packageName}</span>
                </div>
            </div>

            <p className="encoder-description">{description}</p>

            <h2>📦 Installation</h2>
            <div className={styles.versionRow}>
                <span className={styles.versionLabel}>Latest version : {latestVersion}</span>
                <a
                    href={tagsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.versionTagsLink}
                    style={{ marginLeft: 10, fontSize: 14 }}
                >
                    View all versions
                </a>
            </div>
            <CodeBlock language="bash">
                {installCmd}
            </CodeBlock>

            {installationNotes && (
                <div className="admonition admonition-info">
                    <div className="admonition-content">
                        <p>{installationNotes}</p>
                    </div>
                </div>
            )}

            {dependencies.length > 0 && (
                <>
                    <h3>Dependencies</h3>
                    <ul>
                        {dependencies.map((dep, index) => (
                            <li key={index}>{dep}</li>
                        ))}
                    </ul>
                </>
            )}

            <h2>🚀 Usage</h2>
            <CodeBlock language="go">
                {usageExample}
            </CodeBlock>

            {decodeExample && (
                <>
                    <h2>🔄 Decoding Example</h2>
                    <CodeBlock language="go">
                        {decodeExample}
                    </CodeBlock>
                </>
            )}

            {notes.length > 0 && (
                <>
                    <h2>📝 Notes</h2>
                    <ul>
                        {notes.map((note, index) => (
                            <li key={index}>{note}</li>
                        ))}
                    </ul>
                </>
            )}

            {links.length > 0 && (
                <>
                    <h2>🔗 Additional Resources</h2>
                    <ul>
                        {links.map((link, index) => (
                            <li key={index}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    {link.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}