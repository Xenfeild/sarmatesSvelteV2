<script>
    import { onMount } from "svelte";
    import { translations, loadTranslations } from '../stores/translationStore';

    onMount(() => {
        const userLang = navigator.language || navigator.language;
        const lang = userLang.split('-')[0]; // 'fr', 'en', 'es'
        loadTranslations(lang);
    });
</script>

<section id="discography">
    <h2>{$translations.discography}</h2>
    <div class="content">
        <div class="container">
            <div class="album">
                <div class="albumCover">
                    <h3>Sarmates</h3>
                    <img src="/src/lib/img/pochette_sarmates.png" alt="">
                </div>
                <div class="tracklist">
                    <div class="track">
                        <h4>Sherazadjanam</h4>
                        <iframe width="300px" height="100" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1821955674&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/sarmates" title="Sarmates" target="_blank" style="color: #cccccc; text-decoration: none;">Sarmates</a> · <a href="https://soundcloud.com/sarmates/sherazadjanam" title="Sherazadjanam" target="_blank" style="color: #cccccc; text-decoration: none;">Sherazadjanam</a></div>
                    </div>
                    <div class="track">
                        <h4>Kötüyüm</h4>
                        <iframe width="300px" height="100" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1821955644&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/sarmates" title="Sarmates" target="_blank" style="color: #cccccc; text-decoration: none;">Sarmates</a> · <a href="https://soundcloud.com/sarmates/kotuyum" title="Kotüyüm" target="_blank" style="color: #cccccc; text-decoration: none;">Kotüyüm</a></div>
                    </div>
                    <div class="track">
                        <h4>Legion</h4>
                        <iframe width="300px" height="100" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1821955665&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/sarmates" title="Sarmates" target="_blank" style="color: #cccccc; text-decoration: none;">Sarmates</a> · <a href="https://soundcloud.com/sarmates/legion" title="Legion" target="_blank" style="color: #cccccc; text-decoration: none;">Legion</a></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section> 

<style lang="scss">
    @import "../style/style.scss";

    .container{
        width: 90%;
        .album{
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 1rem;
            @media (min-width: 768px){
                flex-direction: row;
            }
            .albumCover{
                text-align: center;
                font-family: $title-font;
                height: clamp(300px, 30vw, 455px);
                width: clamp(300px, 30vw, 455px);
                margin: 1rem;
                h3 {
                    background-color: $third-color;
                    font-size: 1.7rem;
                    font-weight: 400;
                }
                img {
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                }
                }
            }
            .tracklist{
                margin: 2rem;
                background-color: rgba(0, 0, 0, 0.429);
                padding: 1rem;
                height: 460px;
                h4 {
                    font-family: $title-font;
                    text-align: center;
                    font-size: 1.3rem;
                    font-weight: 300;
                }
            }     
        }
</style>