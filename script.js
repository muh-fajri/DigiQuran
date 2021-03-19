/* Scroll to Top */
btnTop = document.getElementById("toTop");
window.onscroll = function() {
    scroll()
};
const scroll = () => {
    if(document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
        btnTop.style.display = "block";
    } else {
        btnTop.style.display = "none";
    }
}
const gotoTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
/*-- Scroll to Top --*/

/* Button Open and Close Search */
const openSearch = () => {
    document.getElementsByClassName("search-menu")[0].style.display = "flex";
}
const closeSearch = () => {
    document.getElementsByClassName("search-menu")[0].style.display = "none";
}
/*-- Button Open and Close Search --*/

/* Metode Request Web API :
 * - Dengan HTTP Request
 * - Dengan AJAX   -> $.ajax()
 * - Dengan jQuery -> $getJSON()
*/

/* Request Web API */
$.ajax({
    url: 'https://api.quran.sutanlab.id/surah',
    type: 'get',
    dataType: 'json',
    data: '',
    success: (data) => {
        // console.log(data);
        // if(data.Response == "True") {
        //     console.log(data.Response);
            let surah = data.data;
            $.each(surah, (i, data) => {
                // console.log(i);
                // console.log(data);
                $('#surah-list').append(`
                    <div class="card">
                        <h2 class="surah-name" data-id="${data.number}">${data.name.long}</h2>
                        <h3 class="latin-name">${data.name.transliteration.id} (${data.number})</h3>
                        <p class="surah-attribute"><span class="ayah-count">${data.numberOfVerses} ayat</span></p>
                        <p class="surah-translation">${data.name.translation.id}</p>
                    </div>
                `);
            });
        // } else {
        //     $('#surah-list').html(data.Error);
        // }
    }
});

$('#surah-list').on('click', '.surah-name', function() {
    $('#surah-list').html('');
    // console.log($(this).data("id"));
    let number = $(this).data("id");
    // console.log(nomor);
    // console.log($('.surah-name').data('id'));

    // $.getJSON('./res_SurahFatihah.json', (data) => {
    $.ajax({
        url: `https://api.quran.sutanlab.id/surah/${number}`,
        type: 'get',
        dataType: 'json',
        data: '',
        success: (data) => {
            // console.log(data);
            let surah = data.data;
            // console.log(surah);
            if((`${surah.number}` == '1') || (`${surah.number}` == '9')) {
                $('#surah-content').append(`
                    <div class="back-bar">
                        <p><a href="./index.html"><span class="fas fa-angle-left"></span> Kembali</a></p>
                    </div>
                    <div class="title" style="text-align:center">
                        <h2>${surah.name.long}</h2>
                        <p>
                            <span>${surah.name.transliteration.id}</span>
                            <span>(${surah.name.translation.id})</span>
                        </p>
                        <p>
                            <span>${surah.revelation.id} - </span>
                            <span dir="rtl" class="revelation">${surah.revelation.arab}</span>
                        </p>
                        <p style="font-size:14px;font-weight:bold">
                            <span>Surah ke-${surah.number}</span>
                            :
                            <span>${surah.numberOfVerses} ayat</span>
                        </p>
                    </div>
                `);
            } else {
                $('#surah-content').append(`
                    <div class="back-bar">
                        <p><a href="./index.html"><span class="fas fa-angle-left"></span> Kembali</a></p>
                    </div>
                    <div class="title" style="text-align:center">
                        <h2>${surah.name.long}</h2>
                        <p>
                            <span>${surah.name.transliteration.id}</span>
                            <span>(${surah.name.translation.id})</span>
                        </p>
                        <p>
                            <span>${surah.revelation.id} - </span>
                            <span dir="rtl" class="revelation">${surah.revelation.arab}</span>
                        </p>
                        <p style="font-size:14px;font-weight:bold">
                            <span>Surah ke-${surah.number}</span>
                            :
                            <span>${surah.numberOfVerses} ayat</span>
                        </p>
                        <div class="preBismillah">
                            <p class="bismillah">${surah.preBismillah.text.arab}</p>
                        </div>
                    </div>
                `);
            }
            let verses = data.data.verses;
            // console.log(verses);
            $.each(verses, (i, data) => {
                // console.log(i);
                // console.log(data);
                $('#surah-content').append(`
                    <div class="detail">
                        <p class="meta">
                            <span>${data.number.inSurah}</span>
                            <a style="display:none" class="tafsir" href="#" data-tafsir="${data.number.inSurah}"><span class="fas fa-book"></a>
                            <a style="display:none"><span class="fas fa-play"></a>
                        </p>
                        <audio controls>
                            <source src="${data.audio.primary}">
                        </audio>
                        <p class="arab" dir="rtl">${data.text.arab}</p>
                        <p class="trs">${data.text.transliteration.en}</p>
                        <p class="idn">${data.translation.id}</p>
                    </div>
                `);
            });
        }
    });
});
/*-- Request Web API --*/