/* Scroll to Top */
$(window).scroll(function() {
    if($(this).scrollTop() > 250)
        $('#toTop').fadeIn();
    else
        $('#toTop').fadeOut();
});
// Click event
$('#toTop').click(function() {
    $('html, body').animate({scrollTop: 0});
    return false;
});
/*-- Scroll to Top --*/

/* Button Open and Close Search */
$('#open-search').click(function(e) {
    e.preventDefault();
    $('.search-menu').fadeIn().css('display','flex');
});

$('#close-search').click(function() {
    $('.search-menu').fadeOut();
});
/*-- Button Open and Close Search --*/

/* Web API Request Method :
 * - HTTP Request
 * - AJAX   -> $.ajax()
 * - jQuery -> $getJSON()
 */

/* Request Web API */
$.ajax({
    url: 'https://api.quran.gading.dev/surah',
    type: 'get',
    dataType: 'json',
    data: '',
    success: (data) => {
        let surah = data.data;
        $.each(surah, (i, data) => {
            $('#surah-list').append(`
                <div class="card">
                    <h2 class="surah-name" data-id="${data.number}">${data.name.long}</h2>
                    <h3 class="latin-name">${data.name.transliteration.en} (${data.number})</h3>
                    <p class="surah-attribute"><span class="ayah-count">${data.numberOfVerses} ayat</span></p>
                    <p class="surah-translation">${data.name.translation.en}</p>
                </div>
            `);
        });
    }
});

$('#surah-list').on('click', '.surah-name', function() {
    $('#surah-list').html('');
    let number = $(this).data("id");
    $.ajax({
        url: `https://api.quran.gading.dev/surah/${number}`,
        type: 'get',
        dataType: 'json',
        data: '',
        success: (data) => {
            let surah = data.data;
            if((`${surah.number}` == '1') || (`${surah.number}` == '9')) {
                $('#surah-content').append(`
                    <div class="back-bar">
                        <p><a href="./index_en.html"><span class="fas fa-angle-left"></span> Back</a></p>
                    </div>
                    <div class="title" style="text-align:center">
                        <h2>${surah.name.long}</h2>
                        <p>
                            <span>${surah.name.transliteration.en}</span>
                            <span>(${surah.name.translation.en})</span>
                        </p>
                        <p>
                            <span>${surah.revelation.en} - </span>
                            <span dir="rtl" class="revelation">${surah.revelation.arab}</span>
                        </p>
                        <p style="font-size:14px;font-weight:bold">
                            <span>Surah ${surah.number}</span>
                            :
                            <span>${surah.numberOfVerses} ayat</span>
                        </p>
                    </div>
                `);
            } else {
                $('#surah-content').append(`
                    <div class="back-bar">
                        <p><a href="./index_en.html"><span class="fas fa-angle-left"></span> Back</a></p>
                    </div>
                    <div class="title" style="text-align:center">
                        <h2>${surah.name.long}</h2>
                        <p>
                            <span>${surah.name.transliteration.en}</span>
                            <span>(${surah.name.translation.en})</span>
                        </p>
                        <p>
                            <span>${surah.revelation.en} - </span>
                            <span dir="rtl" class="revelation">${surah.revelation.arab}</span>
                        </p>
                        <p style="font-size:14px;font-weight:bold">
                            <span>Surah ${surah.number}</span>
                            :
                            <span>${surah.numberOfVerses} ayat</span>
                        </p>
                        <div class="preBismillah">
                            <p class="bismillah">${surah.preBismillah.text.arab}</p>
                        </div>
                    </div>
                `);
            }
            console.log(data);
            let verses = data.data.verses;
            $.each(verses, (i, data) => {
                $('#surah-content').append(`
                    <div class="detail">
                        <p class="meta">
                            <span>${surah.number} : ${data.number.inSurah}</span>
                            <a style="display:none" class="tafsir"><span class="fas fa-book"></a>
                            <a style="display:none"><span class="fas fa-play"></a>
                        </p>
                        <audio controls>
                            <source src="${data.audio.secondary[1]}">
                        </audio>
                        <p class="arab" dir="rtl">${data.text.arab}</p>
                        <p class="trs">${data.text.transliteration.en}</p>
                        <p class="idn">${data.translation.en}</p>
                    </div>
                `);
            });
        }
    });
});
/*-- Request Web API --*/

/* Live Search */
$(document).ready(function() {
    $('#search-box').on('keyup', function() {
        let value = $(this).val().toLowerCase();
        if(value.length != 0) {
            $('.card').filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            })
        } else {
            $('.card').show();
        }
    });
});

$(document).ready(function() {
    $('#search-box').on('keyup', function() {
        let value = $(this).val().toLowerCase();
        if(value.length != 0) {
            $('.detail').filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            })
        } else {
            $('.detail').show();
        }
    });
});
/*-- Live Search --*/