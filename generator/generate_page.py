import os
import jinja2
from babel.support import Translations


def render_page(env: jinja2.Environment, name: str, **values) -> str:
    template = env.get_template(f"{name}.template.html")
    return template.render(values)


def write_main_page(env: jinja2.Environment, lang: list, main_lang: int, file_prefix: str):
    other_lang = lang[(main_lang + 1) % len(lang)]
    nav_content = render_page(env, "nav", other_lang=other_lang[0],
                              lang_dest=os.path.relpath(other_lang[1], file_prefix))
    home_content = render_page(env, "home")
    resume_content = render_page(env, "resume")
    projects_content = render_page(env, "projects")
    footer_content = render_page(env, "footer")

    page_content = "\n\n".join([nav_content, home_content, resume_content, projects_content, footer_content])

    os.makedirs(os.path.dirname(lang[main_lang][1]), exist_ok=True)
    with open(lang[main_lang][1], "wb") as f:
        f.write(render_page(env, "index", lang=lang[main_lang][0], page_content=page_content).encode("utf-8"))


if __name__ == "__main__":
    prefix = r".."
    languages = [
        ("de", os.path.join(prefix, "index.html")),
        ("en", os.path.join(prefix, "locale/en/index.html"))
    ]

    for i in range(len(languages)):
        translations = Translations.load("locale", [languages[i][0]])
        environment = jinja2.Environment(loader=jinja2.FileSystemLoader("./templates"),
                                         extensions=["jinja2.ext.i18n"])
        # noinspection PyUnresolvedReferences
        environment.install_gettext_translations(translations)
        write_main_page(environment, languages, i, prefix)
