---
title: Digital Publishing needs New&nbsp;Tools
date: 2015-11-08
header: bg-maroon white
---

I just attended the 2015 conference of the [Museum Computer Network](http://mcn.edu/) – my first time attending a conference specific to the museum world. This event was filled with interesting people and discussions, and it was a real pleasure to participate.

The discussions around digital publishing in particular have left me with a sense that our community of museum technologists has its work cut out for it. As an example, here are some of the challenges that came up in the [panel discussion on digital publishing](http://sched.co/3rl4) on the conference’s last day:

- Kris Thayer (MIA) talked about building twelve issues of an award-winning digital magazine using the Adobe DPS tools. However, due to problems of vendor-lock-in and the proprietary nature of the platform, her team is not continuing their work in this format. When their Adobe DPS license expires, two years of work will disappear from the Apple Newsstand, as if they had never existed.

- Ahree Lee and Susan Edwards discussed their work on the Digital Mellini project at the Getty. They spent a lot of time coming up with a unique UX for an unconventional publication, but some of the scholars on the project balked at the idea of editing their content in the Drupal interface which powered the backend. To the sound of groans, they described the painstaking process of exporting the content of a massive, born-digital project into MS Word for editing, only to be re-imported upon completion.

- Lauren Makholm (AIC) spoke about the digital publishing program at the Art Institute, where they have successfully launched a series of online art catalogues using the open-source OSCI Toolkit. But even at an institution where buy-in exists at the highest levels, there was plainly some anxiety about how a small team would be able to keep an expanding number of complex web-app publications running for the indefinite future.

### No Silver Bullet (yet)

Digital publishing is still in its infancy – especially in museums and universities. I don’t think anyone has the silver bullet yet. I do think that the stories above represent a set of common problems which plague the industry as a whole: the problems of propriety software and vendor lock-in, of providing tools that non-developers are comfortable with, and of ensuring the long-term accessibility of the work we produce.

> In order to solve the problems our industry faces, we first need to craft better tools.

Specifically, we need a set of tools for digital publishing that can do the following:

1. **Avoid vendor lock-in**. We are living in the midst of an arms race by hardware and platform manufacturers who are competing for dominance. As amazing as the latest innovations by Apple, Google, Adobe, Facebook, et. al. are, I think that we need to resist the temptation of the shiny and new if it comes at the expense of openness and accessibility. This applies both to hardware (like Apple’s iBooks or NewsStand apps) and software (ex., Facebook’s Instant Articles).
2. **Simplify the experience for authors and editors**. There are many great open-source tools for editing text, images, etc. But the interfaces for these tools are often confusing for non-developers. Proprietary applications like MS Word or Google Docs remain dominant for a reason – non-technical users prefer them.
3. **Plan for the long-term**. The technology field is constantly advancing. But in the academic or cultural worlds we have to think with a longer time-horizon in mind. The ethos of “move fast and break things” isn’t going to fly. What will become of our projects five years from now? 10? 20? This is a problem that we don’t share with most of the wider tech industry, but it is hugely important. We’ve been entrusted with the preservation of human knowledge and culture, and we need to choose our tools with that responsibility in mind.

### Next Steps

I believe that the combination of plain-text document formats and static site generators is a powerful tool for digital publishing which could solve many of these problems; this was the subject of [my own talk](#) at MCN 2015. The issue of usability (**#2** above) is where the most work remains to be done.

**A concrete example**: What if we provided authors and editors with a beautiful, distraction-free writing environment instead of the cramped WYSIWYG window included in the typical CMS? What if that editing interface could display the results of `git diff` in place as you typed, a tracked-changes view with all the power of Git under the hood?

The [prose.io](http://prose.io) project is a great example of this kind of technology. With the addition of a few features (better support for footnotes/citation, track changes, etc.) this could be a great tool for creating born-digital publications, one that our scholar and editor colleagues might actually want to use.

The field of digital publishing presents us with many different challenges. Right now I think that we can have the most impact by lowering the barrier to entry that stands between us and many of our colleagues. Can you think of other ways to “humanize” the experience of writing, editing, and publishing with open-source tools?
